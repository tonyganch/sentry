from typing import TYPE_CHECKING, Any, Iterable, Mapping, MutableMapping, Optional, Union

from sentry.notifications.notifications.organization_request.base import (
    OrganizationRequestNotification,
)
from sentry.utils.http import absolute_uri

if TYPE_CHECKING:
    from sentry.models import Organization, Team, User


def get_url(organization: "Organization", provider_type: str, provider_slug: str) -> str:
    # Explicitly typing to satisfy mypy.
    url: str = absolute_uri(
        "/".join(
            [
                "/settings",
                organization.slug,
                {
                    "first_party": "integrations",
                    "plugin": "plugins",
                    "sentry_app": "sentry-apps",
                }.get(provider_type, ""),
                provider_slug,
                "?referrer=request_email",
            ]
        )
    )
    return url


class IntegrationRequestNotification(OrganizationRequestNotification):
    def __init__(
        self,
        organization: "Organization",
        requester: "User",
        provider_type: str,
        provider_slug: str,
        provider_name: str,
        message: Optional[str] = None,
    ) -> None:
        super().__init__(organization, requester)
        self.provider_type = provider_type
        self.provider_slug = provider_slug
        self.provider_name = provider_name
        self.message = message

    def get_context(self) -> MutableMapping[str, Any]:
        return {
            **self.get_base_context(),
            "integration_link": get_url(
                self.organization,
                self.provider_type,
                self.provider_slug,
            ),
            "integration_name": self.provider_name,
            "message": self.message,
        }

    def get_filename(self) -> str:
        return "requests/organization-integration"

    def get_category(self) -> str:
        return "integration_request"

    def get_subject(self, context: Optional[Mapping[str, Any]] = None) -> str:
        return f"Your team member requested the {self.provider_name} integration on Sentry"

    def get_notification_title(self) -> str:
        return self.get_subject()

    def get_type(self) -> str:
        return "organization.integration.request"

    def determine_recipients(self) -> Iterable[Union["Team", "User"]]:
        # Explicitly typing to satisfy mypy.
        recipients: Iterable[Union["Team", "User"]] = self.organization.get_owners()
        return recipients
