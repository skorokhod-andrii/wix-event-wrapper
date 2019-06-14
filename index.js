function wrapper() {
	const elements = {};
	const f = (id) => {
		const result = $w(id);
		if (Array.isArray(result)) { //multiple select
			const methods = Object.getOwnPropertyNames(result).filter(prop => typeof result[prop] === 'function' && prop.slice(0, 2) === 'on');
			return methods.reduce((acc, cur) => {
				acc[cur] = (func) => {
					result.forEach((element => {
						if (!elements[`${element.uniqueId}.${cur}`]) {
							elements[`${element.uniqueId}.${cur}`] = func;
							$w(`#${element.id}`)[cur]((...props) => elements[`${element.uniqueId}.${cur}`](...props));
						} else {
							elements[`${element.uniqueId}.${cur}`] = func;
						}
					}));
				}
				return acc;
			}, result);
		}
		const elementProto = Object.getPrototypeOf(result);
		const nodeProto = Object.getPrototypeOf(elementProto);
		const getMethods = (original, parent) => (
			Object
			.getOwnPropertyNames(parent)
			.filter(prop => typeof original[prop] === 'function' && prop.slice(0, 2) === 'on'));
		const methodsArray = [...getMethods(result, elementProto), ...getMethods(result, nodeProto)];
		return methodsArray.reduce((acc, cur) => {
			acc[cur] = (func) => {
				if (!elements[`${result.uniqueId}.${cur}`]) {
					elements[`${result.uniqueId}.${cur}`] = func;
					$w(id)[cur]((...props) => elements[`${result.uniqueId}.${cur}`](...props));
				} else {
					elements[`${result.uniqueId}.${cur}`] = func;
				}
			}
			return acc;
		}, result);
	}
	f.at = $w.at;
	f.onReady = $w.onReady;
	return f;
}

export default wrapper();