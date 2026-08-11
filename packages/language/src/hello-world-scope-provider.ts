import { DefaultScopeProvider, EMPTY_SCOPE, ReferenceInfo, Scope } from "langium";
import { isVariableAccess, VariableAccess } from "./generated/ast.js";

export class HelloWorldScopeProvider extends DefaultScopeProvider {

	override getScope(context: ReferenceInfo): Scope {
		const access = context.container;
		if (isVariableAccess(access) && context.property === VariableAccess.property) {
			const structType = access.variable.ref?.structType?.ref;
			if (structType) {
				return this.createScopeForNodes(structType.properties);
			} else {
				return EMPTY_SCOPE;
			}
		}
		return super.getScope(context);
	}

}
