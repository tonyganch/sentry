from typing import Any, Dict, List, Mapping, Union

from sentry.integrations.slack.message_builder import SlackBody
from sentry.integrations.slack.message_builder.base.base import SlackMessageBuilder
from sentry.integrations.slack.message_builder.issues import (
    build_attachment_title,
    get_title_link,
    SlackIssuesMessageBuilder
)
from sentry.models import Team, User
from sentry.notifications.notifications.activity.release import ReleaseActivityNotification
from sentry.notifications.notifications.base import BaseNotification, ProjectNotification
from sentry.notifications.utils import get_release
from sentry.utils.http import absolute_uri

from ..utils import build_notification_footer


def build_deploy_buttons(notification: ReleaseActivityNotification) -> List[Dict[str, str]]:
    buttons = []
    if notification.release:
        release = get_release(notification.activity, notification.project.organization)
        if release:
            for project in notification.release.projects.all():
                project_url = absolute_uri(
                    f"/organizations/{project.organization.slug}/releases/{release.version}/?project={project.id}&unselectedSeries=Healthy/"
                )
                buttons.append(
                    {
                        "text": project.slug,
                        "name": project.slug,
                        "type": "button",
                        "url": project_url,
                    }
                )
    return buttons


class SlackNotificationsMessageBuilder(SlackMessageBuilder):
    def __init__(
        self,
        notification: BaseNotification,
        context: Mapping[str, Any],
        recipient: Union["Team", "User"],
    ) -> None:
        super().__init__()
        self.notification = notification
        self.context = context
        self.recipient = recipient


class SlackProjectNotificationsMessageBuilder(SlackNotificationsMessageBuilder):
    def __init__(
        self,
        notification: ProjectNotification,
        context: Mapping[str, Any],
        recipient: Union["Team", "User"],
    ) -> None:
        super().__init__(notification, context, recipient)
        # TODO: use generics here to do this
        self.notification: ProjectNotification = notification

    def build(self) -> SlackBody:
        group = getattr(self.notification, "group", None)
        return self._build(
            title=build_attachment_title(group),
            title_link=get_title_link(group, None, False, True, self.notification),
            text=self.notification.get_message_description(),
            footer=build_notification_footer(self.notification, self.recipient),
            color="info",
        )


class SlackIssuesMessageBuilder2(SlackProjectNotificationsMessageBuilder):
    def build(self) -> SlackBody:
        group = getattr(self.notification, "group", None)
        return SlackIssuesMessageBuilder(
            group=group,
            event=getattr(self.notification, "event", None),
            tags=self.context.get("tags", None),
            rules=getattr(self.notification, "rules", None),
            issue_details=True,
            notification=self.notification,
            recipient=self.recipient,
        ).build()
