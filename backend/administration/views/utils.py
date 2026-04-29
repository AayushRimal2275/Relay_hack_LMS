"""Consistent response helper used across all views."""


def success(data=None, message="success", status=200):
    return {"status": "success", "message": message, "data": data}


def error(message="error", status=400):
    return {"status": "error", "message": message}
