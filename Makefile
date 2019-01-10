validate-no-uncommitted-package-lock-changes:
	git diff --exit-code package-lock.json
