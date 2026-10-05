@echo off
echo =========================================================================
echo  RASAD-AI Diagnostic & Verification Test Suite (.venv)
echo =========================================================================
echo.
echo [1/2] Running Automated Diagnostic Harness...
".venv\Scripts\python.exe" tests\verify_backend.py
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Verification harness failed!
    exit /b %ERRORLEVEL%
)

echo.
echo [2/2] Running Complete Unittest Test Suite...
".venv\Scripts\python.exe" -m unittest "tests\test_suite.py" -v
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Unittests failed!
    exit /b %ERRORLEVEL%
)

echo.
echo =========================================================================
echo  ALL TESTS PASSED SUCCESSFULLY ON LOCAL .VENV!
echo =========================================================================
