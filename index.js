function wrapper() {
	const elements = {};
	const f = (id) => {
		const obj = $w(id);
		if (Array.isArray(obj)) { //multiple select
			const methods = Object.getOwnPropertyNames(obj).filter(prop => typeof obj[prop] === 'function' && prop.slice(0, 2) === 'on');
			return methods.reduce((acc, cur) => {
				acc[cur] = (func) => {
					obj.forEach((element => {
						if (!elements[`${element.uniqueId}.${cur}`]) {
							elements[`${element.uniqueId}.${cur}`] = func;
							$w(`#${element.id}`)[cur]((...props) => elements[`${element.uniqueId}.${cur}`](...props));
						} else {
							elements[`${element.uniqueId}.${cur}`] = func;
						}
					}));
				}
				return acc;
			}, obj);
		}
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
	f.at = $w.at;
	f.onReady = $w.onReady;
	return f;
}

export default wrapper();