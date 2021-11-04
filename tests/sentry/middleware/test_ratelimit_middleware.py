import time
from unittest.mock import patch

from django.test import RequestFactory
from exam import fixture

from sentry.api.base import Endpoint
from sentry.auth.access import from_request
from sentry.middleware.ratelimit import RatelimitMiddleware, get_rate_limit_key
from sentry.testutils import TestCase


class RatelimitMiddlewareTest(TestCase):
    middleware = fixture(RatelimitMiddleware)
    factory = fixture(RequestFactory)
    view = lambda x: None

    @patch("sentry.middleware.ratelimit.get_default_rate_limit")
    def test_positive_rate_limit_check(self, default_rate_limit_mock):
        request = self.factory.get("/")
        default_rate_limit_mock.return_value = (0, 100)
        self.middleware.process_view(request, self.view, [], {})
        assert request.will_be_rate_limited

        # 10th request in a 10 request window should get rate limited
        # the call above still counts
        default_rate_limit_mock.return_value = (10, 100)
        for _ in range(9):
            self.middleware.process_view(request, self.view, [], {})
            assert not request.will_be_rate_limited

        self.middleware.process_view(request, self.view, [], {})
        assert request.will_be_rate_limited

    @patch("sentry.middleware.ratelimit.get_default_rate_limit")
    def test_negative_rate_limit_check(self, default_rate_limit_mock):
        request = self.factory.get("/")
        default_rate_limit_mock.return_value = (10, 100)
        self.middleware.process_view(request, self.view, [], {})
        assert not request.will_be_rate_limited

        # Requests outside the current window should get
        default_rate_limit_mock.return_value = (1, 1)
        self.middleware.process_view(request, self.view, [], {})
        assert not request.will_be_rate_limited
        time.sleep(1)
        self.middleware.process_view(request, self.view, [], {})
        assert not request.will_be_rate_limited

    def test_get_rate_limit_key(self):
        # Mock view class
        class OrganizationGroupIndexEndpoint(Endpoint):
            pass

        self.view = OrganizationGroupIndexEndpoint
        request = self.factory.get("/")
        request.session = {}
        request.user = self.user
        request.access = from_request(request, self.organization)

        assert (
            get_rate_limit_key(self.view, request)
            == "ip:OrganizationGroupIndexEndpoint:GET:127.0.0.1"
        )
        assert (
            get_rate_limit_key(self.view, request, "user")
            == f"user:OrganizationGroupIndexEndpoint:GET:{self.user.id}"
        )
        assert (
            get_rate_limit_key(self.view, request, "org")
            == f"org:OrganizationGroupIndexEndpoint:GET:{self.organization.id}"
        )
