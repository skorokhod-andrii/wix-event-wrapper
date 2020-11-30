function wrapper() {
	const elements = {};
	const f = (selector) => {
			const result = $w(selector);
			const elementProto = Object.getPrototypeOf(result);
			const nodeProto = Object.getPrototypeOf(elementProto);
			const getMethods = (child, parent) => (
					Object
					.getOwnPropertyNames(parent)
					.filter(prop => typeof child[prop] === 'function' && prop.slice(0, 2) === 'on'));
			if (Array.isArray(result)) { //multiple select
					const methods = Object.getOwnPropertyNames(result).filter(prop => typeof result[prop] === 'function' && prop.slice(0, 2) === 'on');
					return methods.reduce((acc, cur) => {
							acc[cur] = (func) => {
									result.forEach((element => {
											if (!elements[`${element.id}.${cur}.${element.uniqueId}`]) {
													elements[`${element.id}.${cur}.${element.uniqueId}`] = func;
													$w(`#${element.id}`)[cur]((...props) => elements[`${element.id}.${cur}.${element.uniqueId}`](...props));
											} else {
													elements[`${element.id}.${cur}.${element.uniqueId}`] = func;
											}
									}));
							}
							return acc;
					}, result);
			}
			//if nodeProto exist - old version, if doesn't - new version
			const methods = nodeProto ? [...getMethods(result, elementProto), ...getMethods(result, nodeProto)] :
					Object.getOwnPropertyNames(result).filter(prop => typeof result[prop] === 'function' && prop.slice(0, 2) === 'on');
			return methods.reduce((acc, cur) => {
					const oldMethod = acc[cur].bind(acc);
					acc[cur] = (func) => {
							if (!elements[`${result.id}.${cur}.${result.uniqueId}`]) {
									elements[`${result.id}.${cur}.${result.uniqueId}`] = func;
									oldMethod((...props) => {
											elements[`${result.id}.${cur}.${result.uniqueId}`](...props) });
							} else {
									elements[`${result.id}.${cur}.${result.uniqueId}`] = func;
							}
					}
					return acc;
			}, result);
	};
	Object.getOwnPropertyNames($w).filter(prop => typeof $w[prop] === 'function').reduce((acc, cur) => { acc[cur] = $w[cur]; return acc }, f);
	return f;
}
/** @type {$w.$w} */
const $e = wrapper();
export default $e;
/**
* @param {string} repeaterId
* @param {$w.Event} event
* @returns {{
* $item: $w.$w,
* itemData: any;
* index: number;
* }}
*/
export function getRepeaterCallbackArguments(repeaterId, event) {
	const data = $e(repeaterId).data;
	const index = data.findIndex(item => item._id === event.context.itemId);
	return {
			$item: $e.at(event.context),
			itemData: data[index],
			index,
	};
}
