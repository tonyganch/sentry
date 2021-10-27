import abc
import logging
from typing import TYPE_CHECKING, Any, Iterable, Mapping, MutableMapping, Union

from sentry import features
from sentry.integrations.slack.message_builder.organization_requests import (
    SlackOrganizationRequestMessageBuilder,
)
from sentry.integrations.slack.utils.notifications import get_settings_url
from sentry.models import OrganizationMember, Team
from sentry.notifications.notifications.base import BaseNotification
from sentry.notifications.notify import notification_providers
from sentry.types.integrations import ExternalProviders

if TYPE_CHECKING:
    from sentry.models import Organization, User

logger = logging.getLogger(__name__)


class OrganizationRequestNotification(BaseNotification, abc.ABC):
    message_builder = SlackOrganizationRequestMessageBuilder
    analytics_event: str = ""
    referrer: str = ""
    member_by_user_id: MutableMapping[int, OrganizationMember] = {}

    def __init__(self, organization: "Organization", requester: "User") -> None:
        super().__init__(organization)
        self.requester = requester

    def get_reference(self) -> Any:
        return self.organization

    def get_context(self) -> MutableMapping[str, Any]:
        return {}

    @property
    def sentry_query_params(self) -> str:
        return "?referrer=" + self.referrer

    def determine_recipients(self) -> Iterable[Union["Team", "User"]]:
        members = self.determine_member_recipients()
        # store the members in our cache
        for member in members:
            self.set_member_in_cache(member)
        # convert members to users
        return map(lambda member: member.user, members)

    def determine_member_recipients(self) -> Iterable["OrganizationMember"]:
        """
        Depending on the type of request this might be all organization owners,
        a specific person, or something in between.
        """
        raise NotImplementedError

    def get_participants(self) -> Mapping[ExternalProviders, Iterable[Union["Team", "User"]]]:
        available_providers: Iterable[ExternalProviders] = {ExternalProviders.EMAIL}
        if features.has("organizations:slack-requests", self.organization):
            available_providers = notification_providers()

        # TODO: need to read off notification settings
        recipients = self.determine_recipients()
        return {provider: recipients for provider in available_providers}

    def send(self) -> None:
        from sentry.notifications.notify import notify

        participants_by_provider = self.get_participants()
        if not participants_by_provider:
            return

        context = self.get_context()
        for provider, recipients in participants_by_provider.items():
            notify(provider, self, recipients, context)

    def get_member(self, user: "User") -> "OrganizationMember":
        # cache the result
        if user.id not in self.member_by_user_id:
            self.member_by_user_id[user.id] = OrganizationMember.objects.get(
                user=user, organization=self.organization
            )
        return self.member_by_user_id[user.id]

    def set_member_in_cache(self, member: OrganizationMember) -> None:
        """
        A way to set a member in a cache to avoid a query.
        """
        self.member_by_user_id[member.user_id] = member

    def build_notification_footer(self, recipient: Union["Team", "User"]) -> str:
        # not implemented for teams
        if isinstance(recipient, Team):
            raise NotImplementedError
        recipient_member = self.get_member(recipient)
        settings_url = get_settings_url(self, recipient)
        return f"""You are receiving this notification because you're listed
                    as an organization {recipient_member.role} | <{settings_url}|Notification Settings>"""

    def record_notification_sent(
        self, recipient: Union["Team", "User"], provider: ExternalProviders, **kwargs: Any
    ) -> None:
        super().record_notification_sent(recipient, provider, user_id=self.requester.id, **kwargs)
