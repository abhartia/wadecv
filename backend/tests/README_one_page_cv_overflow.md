## One-page CV overflow tests

- **What these tests do**: exercise the full one-page CV generation and layout review flow for 20 synthetic (CV, job description) pairs and assert that the final exported PDF is exactly one page.
- **Pipeline under test**:
  - `generate_cv` (first pass, `page_limit=1`)
  - `get_cv_layout_feedback` (PDF → images → vision model tweaks)
  - optional second-pass `generate_cv` applying layout tweaks
  - `build_cv_pdf` for the final CV data
  - `pypdf.PdfReader` to count pages

### Running the tests

1. Install backend test dependencies (from the `backend` directory):

   ```bash
   pip install -r requirements.txt
   ```

   Make sure `pytest`, `pytest-asyncio`, and `pypdf` are available in your environment.

2. Enable live AI tests (they hit the model and vision APIs and can be slow/paid):

   ```bash
   export RUN_LIVE_AI_TESTS=1
   ```

3. Run the one-page CV overflow suite:

   ```bash
   pytest tests/test_one_page_cv_overflow.py
   ```

4. To parallelize further with `pytest-xdist` (if installed):

   ```bash
   pytest tests/test_one_page_cv_overflow.py -n auto
   ```

### Notes

- These tests call the **live AI/model API and the layout vision model**, so they are slower and should typically be run on demand (not on every quick edit).
- The tests will be **skipped by default** unless `RUN_LIVE_AI_TESTS=1` is set in the environment.
