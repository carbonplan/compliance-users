from importlib.metadata import version as _version

try:
    __version__ = _version("{{ cookiecutter.project_slug }}")
except Exception:
    __version__ = "9999"
