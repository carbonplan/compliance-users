from importlib.metadata import version as _version

try:
    __version__ = _version("carbonplan_compliance_users")
except Exception:
    __version__ = "9999"
