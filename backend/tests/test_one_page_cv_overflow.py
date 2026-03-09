import asyncio
import io
import os
from typing import Any, Dict, List

import pytest
from pypdf import PdfReader

from app.services.cv_generator import generate_cv
from app.services.cv_layout_feedback import get_cv_layout_feedback
from app.services.docx_builder import build_cv_pdf


LIVE_AI_ENV_VAR = "RUN_LIVE_AI_TESTS"


ONE_PAGE_CASES: List[Dict[str, str]] = [
    {
        "id": "case_01_junior_backend_engineer",
        "original_content": """
John Doe
Junior Backend Engineer

Professional Summary
Entry-level backend engineer with internship experience in building RESTful APIs and background jobs in Python. Passionate about learning modern backend architectures and writing clean, well-tested code.

Experience
Backend Engineering Intern, Acme Labs
06/2023 - 08/2023
- Implemented small REST endpoints in FastAPI and wrote unit tests.
- Optimized simple SQL queries to reduce response time for internal dashboards.
- Collaborated with senior engineers in code reviews and sprint planning.

Education
BSc Computer Science, State University
2019 - 2023
""",
        "job_description": """
Junior Backend Engineer

Responsibilities:
- Implement and maintain RESTful APIs in Python.
- Collaborate with senior engineers on backend features.
- Write tests and participate in code reviews.

Requirements:
- 0-2 years of backend experience.
- Familiarity with Python web frameworks (FastAPI, Django, or Flask).
- Basic SQL knowledge.
""",
    },
    {
        "id": "case_02_mid_fullstack_engineer",
        "original_content": """
Alex Smith
Full-Stack Developer

Professional Summary
Full-stack engineer with 4 years of experience building React frontends and Node/Python backends. Enjoys collaborating with designers and product managers to ship user-facing features quickly.

Experience
Full-Stack Engineer, BrightApps
02/2021 - Present
- Built responsive UI components in React and Tailwind for the core dashboard.
- Designed and implemented REST APIs in Node.js and Python for analytics features.
- Worked closely with product and design to scope and ship user stories.
- Reduced bundle size by introducing code splitting and lazy loading.

Education
BSc Software Engineering, City University
2016 - 2020
""",
        "job_description": """
Full-Stack Engineer

You will:
- Build and maintain React-based user interfaces.
- Work on backend services in Node.js or Python.
- Collaborate cross-functionally with product and design.

We are looking for:
- 3+ years of software engineering experience.
- Experience with React and at least one backend framework.
- Solid understanding of web fundamentals and APIs.
""",
    },
    {
        "id": "case_03_product_manager",
        "original_content": """
Taylor Green
Product Manager

Professional Summary
Product manager with 5+ years of experience leading cross-functional teams to ship B2B SaaS features. Focused on discovery, outcome-oriented roadmaps, and clear communication with stakeholders.

Experience
Product Manager, SaaSCo
03/2020 - Present
- Led discovery and launch of usage-based billing, increasing expansion revenue.
- Partnered with engineering and design to deliver features on a quarterly roadmap.
- Defined and tracked product KPIs and presented results to leadership.

Education
BA Economics, Western College
2012 - 2016
""",
        "job_description": """
Product Manager

Responsibilities:
- Own the roadmap for a B2B SaaS product area.
- Lead discovery with customers and internal stakeholders.
- Collaborate with engineering, design, sales, and marketing.

Requirements:
- 3+ years of product management experience.
- Experience with B2B SaaS products.
- Strong communication and stakeholder management skills.
""",
    },
    {
        "id": "case_04_data_analyst",
        "original_content": """
Jordan Lee
Data Analyst

Professional Summary
Data analyst with strong SQL and dashboarding skills. Experienced in working with business stakeholders to turn questions into metrics and visualizations.

Experience
Data Analyst, Retail Insights
01/2020 - Present
- Built and maintained Looker dashboards for sales and marketing teams.
- Wrote complex SQL to model customer behavior cohorts.
- Partnered with analysts and PMs to define data requirements.

Education
BS Statistics, Northern University
2015 - 2019
""",
        "job_description": """
Data Analyst

You will:
- Build dashboards and reports for business stakeholders.
- Write SQL to answer ad-hoc and recurring questions.
- Collaborate with PMs and analysts on metrics definitions.

Requirements:
- 2+ years in an analytics role.
- Strong SQL skills.
- Experience with at least one BI tool.
""",
    },
    {
        "id": "case_05_marketing_manager",
        "original_content": """
Casey Brown
Marketing Manager

Professional Summary
Marketing professional with experience running multi-channel campaigns, optimizing funnels, and collaborating with sales on pipeline goals.

Experience
Marketing Manager, GrowthPlus
04/2019 - Present
- Planned and executed email and paid campaigns for product launches.
- Partnered with sales to align on MQL definitions and targets.
- Reported on campaign performance and recommended optimizations.

Education
BA Marketing, Lakeside University
2013 - 2017
""",
        "job_description": """
Marketing Manager

Responsibilities:
- Plan and execute demand generation campaigns.
- Collaborate with sales on pipeline and MQL targets.
- Analyze campaign performance and optimize over time.

Requirements:
- 3+ years in B2B marketing.
- Experience with email and paid channels.
- Strong analytical skills.
""",
    },
    {
        "id": "case_06_senior_backend_engineer_dense_experience",
        "original_content": """
Morgan Patel
Senior Backend Engineer

Professional Summary
Senior backend engineer with 8+ years of experience designing, building, and scaling APIs and distributed systems in Python and Go. Comfortable leading projects from design through deployment.

Experience
Senior Backend Engineer, ScaleWorks
01/2021 - Present
- Designed and implemented microservices in Python and Go for billing and authentication.
- Led migration from monolith to service-oriented architecture.
- Mentored junior engineers and ran technical design reviews.
- Improved system observability with metrics, tracing, and logging.
- Partnered with product to scope technically complex projects.

Backend Engineer, WebCloud
06/2016 - 12/2020
- Built and maintained REST APIs for core customer data.
- Worked on performance improvements in database access layer.
- Participated in on-call rotation and incident reviews.

Education
BS Computer Science, Tech Institute
2010 - 2014
""",
        "job_description": """
Senior Backend Engineer

Responsibilities:
- Design and build scalable APIs and backend services.
- Lead technical design and architecture discussions.
- Mentor junior engineers.

Requirements:
- 6+ years of backend engineering experience.
- Strong experience with Python or Go.
- Experience with distributed systems and observability.
""",
    },
    {
        "id": "case_07_ux_designer",
        "original_content": """
Riley Kim
Product Designer

Professional Summary
Product designer focused on interaction design and UX for complex workflows. Experienced in running usability tests and iterating quickly.

Experience
Product Designer, FlowTools
09/2019 - Present
- Designed end-to-end flows for admin dashboards.
- Created prototypes and ran usability sessions with customers.
- Collaborated closely with PMs and engineers to ship improvements.

Education
BDes Interaction Design, Art & Design School
2014 - 2018
""",
        "job_description": """
Product Designer

You will:
- Own end-to-end design for a product area.
- Work with PMs and engineers to deliver high-quality experiences.
- Conduct user research and usability testing.

Requirements:
- 3+ years of product design experience.
- Strong portfolio of shipped work.
- Experience with design tools and prototyping.
""",
    },
    {
        "id": "case_08_project_manager",
        "original_content": """
Jamie Nguyen
Project Manager

Professional Summary
Project manager with experience running cross-functional initiatives, managing timelines, and keeping stakeholders aligned.

Experience
Project Manager, BuildRight
05/2018 - Present
- Coordinated complex implementation projects across engineering and operations.
- Managed project plans, risks, and stakeholder communications.
- Facilitated weekly status meetings and retrospectives.

Education
BA Business Administration, Metro University
2011 - 2015
""",
        "job_description": """
Project Manager

Responsibilities:
- Plan and manage cross-functional projects.
- Communicate progress and risks to stakeholders.
- Facilitate project ceremonies and retrospectives.

Requirements:
- 4+ years of project management experience.
- Experience with agile methodologies.
- Strong communication and organization skills.
""",
    },
    {
        "id": "case_09_support_specialist",
        "original_content": """
Sam Rivera
Customer Support Specialist

Professional Summary
Customer support specialist with experience in SaaS support, troubleshooting, and customer education.

Experience
Customer Support Specialist, HelpCloud
02/2020 - Present
- Resolved customer tickets via email and chat.
- Escalated technical issues to engineering with clear reproduction steps.
- Authored help center articles and how-to guides.

Education
BA Communications, Eastview College
2014 - 2018
""",
        "job_description": """
Customer Support Specialist

You will:
- Respond to customer inquiries via email and chat.
- Troubleshoot and resolve issues or escalate as needed.
- Contribute to customer education content.

Requirements:
- 1+ year in a customer-facing role.
- Strong written communication.
- Experience with support tools is a plus.
""",
    },
    {
        "id": "case_10_hr_generalist",
        "original_content": """
Dana Cole
HR Generalist

Professional Summary
HR generalist with experience across recruiting coordination, onboarding, and HR operations.

Experience
HR Generalist, PeopleFirst
07/2019 - Present
- Coordinated interviews and candidate communication.
- Supported onboarding and benefits questions.
- Helped maintain HRIS data accuracy.

Education
BA Human Resources, Central College
2013 - 2017
""",
        "job_description": """
HR Generalist

Responsibilities:
- Support recruitment and onboarding processes.
- Answer employee questions about benefits and policies.
- Maintain HR records.

Requirements:
- 2+ years in HR or people operations.
- Strong organization and attention to detail.
- Experience with HRIS tools preferred.
""",
    },
    {
        "id": "case_11_ops_manager_dense_but_one_page",
        "original_content": """
Pat Morgan
Operations Manager

Professional Summary
Operations manager overseeing logistics, vendor relationships, and process improvements. Comfortable balancing strategic planning with hands-on execution.

Experience
Operations Manager, ShipFast
03/2018 - Present
- Managed warehouse operations across multiple locations.
- Negotiated contracts with shipping vendors.
- Implemented process changes that reduced errors and delays.
- Collaborated with finance and sales on forecasting and planning.

Education
BA Operations Management, Harbor University
2010 - 2014
""",
        "job_description": """
Operations Manager

You will:
- Oversee day-to-day operations.
- Manage vendor relationships and contracts.
- Drive process improvements and efficiency.

Requirements:
- 4+ years in operations.
- Experience managing logistics or supply chain.
- Strong analytical and communication skills.
""",
    },
    {
        "id": "case_12_junior_product_marketer",
        "original_content": """
Lee Carter
Product Marketing Specialist

Professional Summary
Early-career marketer supporting product launches, messaging, and sales enablement.

Experience
Product Marketing Specialist, LaunchCo
01/2022 - Present
- Helped draft launch emails and website copy.
- Coordinated with sales to share new collateral.
- Collected feedback on messaging from customers and sales.

Education
BA English, Coastal College
2016 - 2020
""",
        "job_description": """
Product Marketing Specialist

Responsibilities:
- Support go-to-market plans for product launches.
- Help create messaging and collateral.
- Work with sales to ensure they have the right materials.

Requirements:
- 0-2 years in marketing or related roles.
- Strong writing skills.
- Interest in technology products.
""",
    },
    {
        "id": "case_13_senior_pm_dense_experience",
        "original_content": """
Jordan Scott
Senior Product Manager

Professional Summary
Senior PM with experience leading complex platform initiatives, working with multiple teams, and driving measurable impact.

Experience
Senior Product Manager, PlatformCo
02/2019 - Present
- Owned the platform roadmap across several internal products.
- Facilitated cross-team alignment meetings and planning.
- Defined KPIs and drove experiments to improve reliability and adoption.
- Worked with engineering leads to break down large initiatives.

Product Manager, GrowthTech
06/2014 - 01/2019
- Managed features for user onboarding and activation.
- Collaborated with marketing on in-product growth experiments.
- Presented roadmap and results to executives.

Education
BS Computer Science, Capital University
2008 - 2012
""",
        "job_description": """
Senior Product Manager

Responsibilities:
- Lead cross-functional teams on complex initiatives.
- Own the roadmap and communicate priorities clearly.
- Define and track product success metrics.

Requirements:
- 6+ years of product management experience.
- Experience with platforms or multi-team products.
- Strong communication and stakeholder management.
""",
    },
    {
        "id": "case_14_mid_frontend_engineer",
        "original_content": """
Chris Allen
Frontend Engineer

Professional Summary
Frontend engineer with 3 years of experience building React applications and component libraries.

Experience
Frontend Engineer, UIWorks
08/2021 - Present
- Built reusable components in React and Storybook.
- Worked with designers to implement responsive layouts.
- Fixed UI bugs and improved performance on key pages.

Education
BS Computer Science, Ridge University
2016 - 2020
""",
        "job_description": """
Frontend Engineer

You will:
- Build and maintain React components and pages.
- Collaborate with designers on UI and UX.
- Help improve frontend performance and reliability.

Requirements:
- 2+ years with React.
- Strong understanding of JavaScript, HTML, and CSS.
- Experience with component libraries.
""",
    },
    {
        "id": "case_15_junior_data_scientist",
        "original_content": """
Taylor Brooks
Junior Data Scientist

Professional Summary
Junior data scientist with internship experience building simple models and dashboards in Python.

Experience
Data Science Intern, InsightLabs
06/2023 - 08/2023
- Built small classification models in Python and scikit-learn.
- Helped prepare data and run experiments.
- Shared findings with the analytics team.

Education
BS Mathematics, Summit College
2019 - 2023
""",
        "job_description": """
Junior Data Scientist

Responsibilities:
- Support data science projects with modeling and analysis.
- Work with data engineers and analysts.
- Communicate findings to stakeholders.

Requirements:
- Familiarity with Python and basic ML concepts.
- Comfort with data analysis and visualization.
- Strong quantitative background.
""",
    },
    {
        "id": "case_16_customer_success_manager",
        "original_content": """
Reese Parker
Customer Success Manager

Professional Summary
Customer success professional focused on onboarding, adoption, and renewals for B2B SaaS products.

Experience
Customer Success Manager, ValueSoft
01/2019 - Present
- Onboarded new customers and led training sessions.
- Held regular check-ins to drive product adoption.
- Partnered with sales on renewals and expansions.

Education
BA Business, Elmwood College
2012 - 2016
""",
        "job_description": """
Customer Success Manager

You will:
- Own a portfolio of customer relationships.
- Drive adoption and ensure customers see value.
- Partner with sales on renewals and growth.

Requirements:
- 3+ years in customer success or account management.
- Strong communication and relationship-building skills.
- Experience with B2B SaaS preferred.
""",
    },
    {
        "id": "case_17_mid_backend_engineer_dense_bullets",
        "original_content": """
Alex Jordan
Backend Engineer

Professional Summary
Backend engineer with experience building APIs, optimizing performance, and maintaining services in production.

Experience
Backend Engineer, DataFlow
03/2020 - Present
- Built and maintained REST APIs in Python and FastAPI.
- Improved database queries and caching strategies.
- Participated in on-call and incident response.
- Worked with product to refine requirements.
- Contributed to internal tools for debugging and metrics.

Education
BS Computer Engineering, Valley University
2014 - 2018
""",
        "job_description": """
Backend Engineer

Responsibilities:
- Build and maintain backend services and APIs.
- Help improve performance and reliability.
- Collaborate with product and other engineers.

Requirements:
- 3+ years of backend experience.
- Strong Python skills.
- Experience with web frameworks and databases.
""",
    },
    {
        "id": "case_18_operations_coordinator",
        "original_content": """
Peyton Diaz
Operations Coordinator

Professional Summary
Operations coordinator supporting scheduling, vendor communication, and day-to-day logistics.

Experience
Operations Coordinator, CityEvents
05/2020 - Present
- Coordinated schedules and logistics for events.
- Communicated with vendors and partners.
- Managed event documentation and checklists.

Education
BA Hospitality Management, River College
2015 - 2019
""",
        "job_description": """
Operations Coordinator

You will:
- Support logistics and scheduling for operations.
- Communicate with vendors and internal teams.
- Keep documentation and checklists up to date.

Requirements:
- 1-3 years in operations or coordination roles.
- Strong organization skills.
- Comfort working in a fast-paced environment.
""",
    },
    {
        "id": "case_19_business_analyst",
        "original_content": """
Quinn Foster
Business Analyst

Professional Summary
Business analyst experienced in requirements gathering, process mapping, and stakeholder communication.

Experience
Business Analyst, ProcessWorks
01/2019 - Present
- Facilitated requirements workshops and documented user stories.
- Created process maps and identified improvement opportunities.
- Worked with product and engineering on solution design.

Education
BA Economics, Westbrook University
2012 - 2016
""",
        "job_description": """
Business Analyst

Responsibilities:
- Gather and document business requirements.
- Map current and future-state processes.
- Collaborate with technical teams on solutions.

Requirements:
- 3+ years as a business analyst.
- Strong communication and documentation skills.
- Experience with process mapping tools is a plus.
""",
    },
    {
        "id": "case_20_small_cv_edge_near_limit",
        "original_content": """
Skyler James
Software Engineer

Professional Summary
Software engineer with experience across frontend and backend, interested in joining a small team and contributing across the stack.

Experience
Software Engineer, StartCo
04/2021 - Present
- Built user-facing features in React.
- Implemented backend endpoints in Python.
- Helped improve deployment and monitoring scripts.

Education
BS Computer Science, Mountain University
2016 - 2020
""",
        "job_description": """
Software Engineer

You will:
- Work across the stack on a small engineering team.
- Build features in React and Python.
- Participate in deployments and monitoring.

Requirements:
- 2-4 years of software engineering experience.
- Experience with modern frontend and backend frameworks.
- Willingness to work broadly across the product.
""",
    },
]


skip_if_no_live_ai = pytest.mark.skipif(
    os.getenv(LIVE_AI_ENV_VAR) != "1",
    reason=f"Set {LIVE_AI_ENV_VAR}=1 to run live AI CV layout overflow tests.",
)


async def _run_full_layout_flow(case: Dict[str, Any]) -> None:
    original_content = case["original_content"]
    job_description = case["job_description"]
    case_id = case["id"]

    # First-pass CV generation for a one-page CV
    cv_data_first = await generate_cv(
        original_content=original_content,
        job_description=job_description,
        additional_info=None,
        user_id="test-user",
        cv_id=case_id,
        page_limit=1,
    )

    # Layout feedback step: this builds a PDF, converts to images, and calls the vision model
    layout_tweaks = await get_cv_layout_feedback(
        cv_data_first,
        page_limit=1,
        user_id="test-user",
        cv_id=case_id,
    )

    cv_data_final = cv_data_first
    if layout_tweaks:
        layout_feedback_text = "Layout feedback (apply these tweaks):\n" + "\n".join(
            f"- {t}" for t in layout_tweaks
        )
        layout_feedback_text = (
            "CRITICAL: This is a one-page CV. Apply the tweaks by shortening or "
            "condensing the professional summary and experience bullets only; do not add "
            "new content and do NOT remove or omit education. Keep all education entries "
            "with degree, institution, dates, and details (honors, coursework, thesis). "
            "The result must still fit on one page.\n\n" + layout_feedback_text
        )
        combined_additional = layout_feedback_text
        cv_data_final = await generate_cv(
            original_content=original_content,
            job_description=job_description,
            additional_info=combined_additional,
            user_id="test-user",
            cv_id=case_id,
            page_limit=1,
        )

    pdf_bytes = build_cv_pdf(cv_data_final, page_limit=1)
    reader = PdfReader(io.BytesIO(pdf_bytes))
    num_pages = len(reader.pages)

    assert (
        num_pages == 1
    ), f"Case {case_id} produced {num_pages} pages after full layout flow (tweaks={len(layout_tweaks)})."


@skip_if_no_live_ai
@pytest.mark.asyncio
async def test_one_page_cv_overflow_full_layout_flow_parallel() -> None:
    tasks = [_run_full_layout_flow(case) for case in ONE_PAGE_CASES]
    await asyncio.gather(*tasks)


@skip_if_no_live_ai
@pytest.mark.asyncio
@pytest.mark.parametrize("case", ONE_PAGE_CASES, ids=[c["id"] for c in ONE_PAGE_CASES])
async def test_one_page_cv_overflow_full_layout_flow_parametrized(case: Dict[str, Any]) -> None:
    await _run_full_layout_flow(case)

