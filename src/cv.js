//This function is copied as-is from awa.cv in jsll. Do not edit.
/* eslint-disable */
export default (function() {
    var UNINITIALIZED_CV = '';
    var base = UNINITIALIZED_CV;
    var currentElement = 0;
    var eventTag = 'cV';
    var header = 'MS-CV';
    var base64CharSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var cv1Constants = {};
    cv1Constants.maxCorrelationVectorLength = 63;
    cv1Constants.baseLength = 16;
    cv1Constants.validationPattern = new RegExp(
      '^[' + base64CharSet + ']{' + cv1Constants.baseLength.toString() + '}(.[0-9]+)+$'
    );
    var cv2Constants = {};
    cv2Constants.maxCorrelationVectorLength = 127;
    cv2Constants.baseLength = 22;
    cv2Constants.validationPattern = new RegExp(
      '^[' + base64CharSet + ']{' + cv2Constants.baseLength.toString() + '}(.[0-9]+)+$'
    );
    var currentCvConstants = cv2Constants;
    var cvVersionAtLatestValidityCheck = 2;
    function isInit() {
      return isValid(storedCv());
    }
    function storedCv() {
      return base.concat('.', currentElement.toString());
    }
    function getValue() {
      var value = storedCv();
      if (isValid(value)) {
        return value;
      }
    }
    function incrementExternal(externalCv) {
      if (isValid(externalCv)) {
        var externalCvParts = externalCv.split('.');
        var numberOfCvParts = externalCvParts.length;
        externalCvParts[numberOfCvParts - 1] = (
          parseInt(externalCvParts[numberOfCvParts - 1], 10) + 1
        ).toString();
        var incrementedCv = '';
        for (var i = 0; i < numberOfCvParts; i++) {
          incrementedCv += externalCvParts[i];
          if (i < numberOfCvParts - 1) {
            incrementedCv += '.';
          }
        }
        var maxLength =
          externalCvParts[0].length === cv2Constants.baseLength
            ? cv2Constants.maxCorrelationVectorLength
            : cv1Constants.maxCorrelationVectorLength;
        if (incrementedCv.length <= maxLength) {
          return incrementedCv;
        }
      }
    }
    function canExtend() {
      var currentCv = storedCv();
      if (isValid(currentCv)) {
        return isLeqThanMaxCorrelationVectorLength(currentCv.length + 2);
      }
      return false;
    }
    function canIncrement() {
      if (isValid(storedCv())) {
        return isLeqThanMaxCorrelationVectorLength(
          base.length + 1 + (currentElement + 1 + '').length
        );
      }
      return false;
    }
    function setValue(cv) {
      if (isValid(cv)) {
        var lastIndex = cv.lastIndexOf('.');
        base = cv.substr(0, lastIndex);
        currentElement = parseInt(cv.substr(lastIndex + 1), 10);
      } else {
        awa.logger.logWarning('Cannot set invalid correlation vector value');
        return null;
      }
      return storedCv();
    }
    function init(cvInitValue) {
      if (cvInitValue) {
        return setValue(cvInitValue);
      } else {
        base = seedCorrelationVector();
        currentElement = 0;
        return getValue();
      }
    }
    function seedCorrelationVector() {
      var result = '';
      for (var i = 0; i < currentCvConstants.baseLength; i++) {
        result += base64CharSet.charAt(Math.floor(Math.random() * base64CharSet.length));
      }
      return result;
    }
    function extend() {
      if (canExtend()) {
        base = base.concat('.', currentElement.toString());
        currentElement = 0;
        return storedCv();
      }
    }
    function increment() {
      if (canIncrement()) {
        currentElement = currentElement + 1;
        return storedCv();
      }
    }
    function isValid(cvValue) {
      if (cvValue) {
        var baseValue = cvValue.split('.')[0];
        if (baseValue) {
          if (baseValue.length === 16) {
            cvVersionAtLatestValidityCheck = 1;
            return validateWithCv1(cvValue);
          } else if (baseValue.length === 22) {
            cvVersionAtLatestValidityCheck = 2;
            return validateWithCv2(cvValue);
          }
        }
      }
    }
    function validateWithCv1(cv) {
      if (
        cv1Constants.validationPattern.test(cv) &&
        cv.length <= cv1Constants.maxCorrelationVectorLength
      ) {
        return true;
      }
    }
    function validateWithCv2(cv) {
      if (
        cv2Constants.validationPattern.test(cv) &&
        cv.length <= cv2Constants.maxCorrelationVectorLength
      ) {
        return true;
      }
    }
    function isLeqThanMaxCorrelationVectorLength(length) {
      if (cvVersionAtLatestValidityCheck === 1) {
        return length <= cv1Constants.maxCorrelationVectorLength;
      } else {
        return length <= cv2Constants.maxCorrelationVectorLength;
      }
    }
    function useCv1() {
      currentCvConstants = cv1Constants;
    }
    function useCv2() {
      currentCvConstants = cv2Constants;
    }
    return {
      header: header,
      tag: eventTag,
      isInit: isInit,
      canExtend: canExtend,
      canIncrement: canIncrement,
      getValue: getValue,
      setValue: setValue,
      init: init,
      extend: extend,
      increment: increment,
      incrementExternal: incrementExternal,
      isValid: isValid,
      useCv1: useCv1,
      useCv2: useCv2,
    };
  })();
  