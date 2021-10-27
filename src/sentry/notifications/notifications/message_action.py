from dataclasses import dataclass
from typing import Optional

from typing_extensions import Literal


@dataclass
class MessageAction:
    label: str
    url: str
    style: Optional[Literal["primary", "danger", "default"]] = None
