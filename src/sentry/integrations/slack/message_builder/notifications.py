from typing import Any, Mapping, Union

from sentry.integrations.slack.message_builder import SlackBody
from sentry.integrations.slack.message_builder.base.base import SlackMessageBuilder
from sentry.integrations.slack.message_builder.issues import (
    SlackIssuesMessageBuilder,
    get_title_link,
)
from sentry.integrations.slack.utils import build_buttons, build_notification_footer
from sentry.models import Team, User
from sentry.notifications.notifications.base import BaseNotification, ProjectNotification


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
            title=self.notification.build_attachment_title(),
            title_link=get_title_link(group, None, False, True, self.notification),
            text=self.notification.get_message_description(),
            actions=build_buttons(self.notification),
            footer=build_notification_footer(self.notification, self.recipient),
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
