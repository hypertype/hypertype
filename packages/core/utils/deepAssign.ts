export function deepAssign(to, ...sources) {
	if (!sources.length) return to;
	return deepAssign(deepAssignInternal(to, sources[0] || {}), ...sources.slice(1));
}

function deepAssignInternal(to = {}, source) {
	if (!to) to = {};
	if (typeof source === "number")
		return source;
	if (typeof source === "string")
		return source;
	if (Array.isArray(source)) {
		return deepArrayAssign(to, source);
	}
	Object.keys(source).forEach(key => {
		to[key] = (source[key] && typeof source[key] === "object")
			? deepAssignInternal(to[key], source[key])
			: source[key];
	});
	return to;
}

function deepArrayAssign(to, from) {
	return [
		...from.map((t, i) => deepAssignInternal(to[i] || {}, from[i])),
		...(Array.isArray(to) ? to.slice(from.length) : [])
	];
}
