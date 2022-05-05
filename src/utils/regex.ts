/**
 * Email REGEX
 */
export const email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
/**
 * CN phone REGEX
 */
export const phone = /^1[3456789]\d{9}$/;
/**
 * password REGEX
 */
export const password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/;
/**
 * nickname REGEX
 */
export const nickname = /^[\u4e00-\u9fa5a-zA-Z0-9]{2,20}$/;
/**
 * CN id Card REGEX
 */
export const idCard = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
/**
 * CN bank Card REGEX
 */
export const bankCard = /^([1-9]{1})(\d{14}|\d{18})$/;