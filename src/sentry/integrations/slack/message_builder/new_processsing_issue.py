from sentry.integrations.slack.message_builder import SlackBody
from sentry.integrations.slack.message_builder.notifications import (
    SlackProjectNotificationsMessageBuilder,
)
from sentry.integrations.slack.utils import build_notification_footer


class SlackNewProcessingIssuesMessageBuilder(SlackProjectNotificationsMessageBuilder):
    def build(self) -> SlackBody:
        return self._build(
            title=self.notification.get_subject(),
            text=self.notification.get_message_description(),
            footer=build_notification_footer(self.notification, self.recipient),
        )
