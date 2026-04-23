from __future__ import annotations

from enum import Enum
from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, Field

SeoContentType = Literal["jobs", "company-resume", "skills", "resume-bullets", "ats", "career-change"]


class ChangeKind(str, Enum):
    ADD_ENTRY = "add_entry"
    UPDATE_ENTRY = "update_entry"
    EXPAND_BODY_AND_FAQ = "expand_body_and_faq"
    TARGET_ADDITIONAL_QUERY = "target_additional_query"
    IMPROVE_META = "improve_meta"
    ADD_RELATED_SLUGS = "add_related_slugs"
    UPDATE_COMPONENT = "update_component"


class EntryDelta(BaseModel):
    """
    A partial JSON fragment compatible with the TypeScript types in
    `frontend/src/lib/seo-content.ts`.

    This is intentionally loose; Cursor can turn this into precise edits to
    the content JSON files.
    """

    slug: Optional[str] = None
    title: Optional[str] = None
    metaDescription: Optional[str] = None
    intro: Optional[str] = None
    body: Optional[str] = None
    faq: Optional[List[Dict[str, str]]] = None
    commonMistakes: Optional[List[str]] = None
    relatedSlugs: Optional[List[str]] = None
    # Additional fields like tips, bulletExamples, etc. can be added as needed.


class SeoChangeProposal(BaseModel):
    """
    A single SEO change suggestion, aligned with the programmatic content model.
    """

    content_type: SeoContentType = Field(..., description="Which of the six SEO sections this change applies to.")
    slug: Optional[str] = Field(
        None,
        description="Existing or proposed slug. For new entries, this is the suggested slug.",
    )
    change_kind: ChangeKind
    proposed_entry_delta: EntryDelta = Field(
        ...,
        description="Partial JSON fragment describing how the entry should change or what to add.",
    )
    priority: Literal["high", "medium", "low"] = "medium"
    rationale: str


class CodePatchProposal(BaseModel):
    """
    Optional code-level patch suggestion for React templates/components.
    """

    file_path: str
    change_type: str
    before_snippet: Optional[str] = None
    after_snippet: Optional[str] = None
    unified_diff: Optional[str] = None


class SeoChangeBatch(BaseModel):
    """
    Container for a batch of content and optional code patch proposals.
    """

    changes: List[SeoChangeProposal]
    code_patches: Optional[List[CodePatchProposal]] = None


__all__ = [
    "SeoContentType",
    "ChangeKind",
    "EntryDelta",
    "SeoChangeProposal",
    "CodePatchProposal",
    "SeoChangeBatch",
]
