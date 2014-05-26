
// The empty function, useful as a dummy constructor in implementing classical inheritance within prototypal inheritance
function empty() {}

// The classical inheritance constructor. Abstracts prototypal inheritance.
// e.g:
//	var TypeB = new Class({
//		extends: TypeA,
//		init: function () {...}
//		overridden: function (Super, ...) {...}
//	});
function Class(members) {
	function constructor() {
		return this.init.apply(this, arguments);
	}
	
	var extends = members.extends || Object;
	var overrides = empty.prototype = extends.prototype;
	var prototype = new empty(); // inheritance without constructor overhead
	constructor.prototype = prototype;
	constructor.overrides = overrides;
	prototype.constructor = constructor;
	delete members.extends;
	
	return constructor.extend(members);
}

// 
Function.prototype.extend = function (members) {
	var prototype = this.prototype;
	var overrides = this.overrides || {};
	
	for (var key in members) {
		if (! members.hasOwnProperty(key)) continue;
		
		var member = members[key];
		var Super = overrides[key];
		
		if (member.isFunction && /\bthis\.Super\b/.test(member) && Super && Super.isFunction) {
			prototype[key] = (function (member, Super) {
				return function bindSuper() {
					var Super0 = this.Super;
					this.Super = Super; // access to overridden function
					var result = member.apply(this, arguments);
					this.Super = Super0;
					return result;
				};
			})(member, Super);
		} else {
			prototype[key] = member;
		}
	}
	
	return this;
};
