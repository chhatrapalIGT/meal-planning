function sendResponse(res, statusCode, message, data) {
  let success = false;
  if (statusCode == 200) {
    success = true;
  }

  if (!data) {
    return res.status(200).json({
      success: success,
      statusCode: statusCode,
      message: message,
    });
  }

  return res.status(200).json({
    success: success,
    statusCode: statusCode,
    message: message,
    data: data,
  });
}

module.exports = sendResponse;
