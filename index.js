function wrapper() {
	const elements = {};
	return (id) => {
		const obj = $w(id);
		const elementProto = Object.getPrototypeOf(obj);
		const nodeProto = Object.getPrototypeOf(elementProto);
		const getMethods = (original, parent) => (
			Object
			.getOwnPropertyNames(parent)
			.filter(prop => typeof original[prop] === 'function' && prop.slice(0, 2) === 'on'));
		const methodsArray = [...getMethods(obj, elementProto), ...getMethods(obj, nodeProto)];
		return methodsArray.reduce((acc, cur) => {
			acc[cur] = (func) => {
				if (!elements[`${obj.uniqueId}.${cur}`]) {
					elements[`${obj.uniqueId}.${cur}`] = func;
					$w(id)[cur]((...props) => elements[`${obj.uniqueId}.${cur}`](...props));
				} else {
					elements[`${obj.uniqueId}.${cur}`] = func;
				}
			}
			return acc;
		}, obj);
	}
}

export default wrapper();