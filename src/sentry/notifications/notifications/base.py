import abc
from typing import TYPE_CHECKING, Any, Mapping, MutableMapping, Optional, Sequence, Tuple, Union

from sentry import analytics
from sentry.integrations.slack.message_builder.issues import build_attachment_title
from sentry.integrations.slack.message_builder.notifications import (
    SlackNotificationsMessageBuilder,
    SlackProjectNotificationsMessageBuilder,
)
from sentry.notifications.notifications.message_action import MessageAction
from sentry.types.integrations import ExternalProviders
from sentry.utils.http import absolute_uri

if TYPE_CHECKING:
    from sentry.models import Organization, Project, Team, User


class BaseNotification(abc.ABC):
    fine_tuning_key: Optional[str] = None
    metrics_key: str = ""
    analytics_event = None
    message_builder = SlackNotificationsMessageBuilder

    def __init__(self, organization: "Organization"):
        self.organization = organization

    @property
    def org_slug(self) -> str:
        return str(self.organization.slug)

    def get_filename(self) -> str:
        raise NotImplementedError

    def get_category(self) -> str:
        raise NotImplementedError

    def get_subject(self, context: Optional[Mapping[str, Any]] = None) -> str:
        """The subject line when sending this notifications as an email."""
        raise NotImplementedError

    def get_reference(self) -> Any:
        raise NotImplementedError

    def get_reply_reference(self) -> Optional[Any]:
        return None

    def should_email(self) -> bool:
        return True

    def get_template(self) -> str:
        return f"sentry/emails/{self.get_filename()}.txt"

    def get_html_template(self) -> str:
        return f"sentry/emails/{self.get_filename()}.html"

    def get_recipient_context(
        self, recipient: Union["Team", "User"], extra_context: Mapping[str, Any]
    ) -> MutableMapping[str, Any]:
        # Basically a noop.
        return {**extra_context}

    def get_notification_title(self) -> str:
        raise NotImplementedError

    def build_attachment_title(self) -> str:
        raise NotImplementedError

    def get_message_description(self) -> Any:
        context = getattr(self, "context", None)
        return context["text_description"] if context else None

    def get_message_actions(self) -> Sequence[MessageAction]:
        return []

    def get_type(self) -> str:
        raise NotImplementedError

    def get_unsubscribe_key(self) -> Optional[Tuple[str, int, Optional[str]]]:
        return None

    def record_notification_sent(
        self, recipient: Union["Team", "User"], provider: ExternalProviders, **kwargs: Any
    ) -> None:
        analytics.record(
            f"integrations.{provider.name}.notification_sent",
            actor_id=recipient.id,
            category=self.get_category(),
            organization_id=self.organization.id,
            **kwargs,
        )

    def get_log_params(self, recipient: Union["Team", "User"]) -> Mapping[str, Any]:
        return {
            "organization_id": self.organization.id,
            "actor_id": recipient.actor_id,
        }


class ProjectNotification(BaseNotification, abc.ABC):
    message_builder = SlackProjectNotificationsMessageBuilder

    def __init__(self, project: "Project") -> None:
        self.project = project
        super().__init__(project.organization)

    def get_project_link(self) -> str:
        # Explicitly typing to satisfy mypy.
        project_link: str = absolute_uri(f"/{self.organization.slug}/{self.project.slug}/")
        return project_link

    def record_notification_sent(
        self, recipient: Union["Team", "User"], provider: ExternalProviders, **kwargs: Any
    ) -> None:
        super().record_notification_sent(recipient, provider, project_id=self.project.id, **kwargs)

    def get_log_params(self, recipient: Union["Team", "User"]) -> Mapping[str, Any]:
        return {"project_id": self.project.id, **super().get_log_params(recipient)}

    def build_attachment_title(self) -> str:
        group = getattr(self, "group", None)
        return build_attachment_title(group)
