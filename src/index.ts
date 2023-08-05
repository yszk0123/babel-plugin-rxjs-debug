import { PluginObj, Visitor, types } from '@babel/core';
import template from '@babel/template';

const SUBJECT_LIST = ['Subject', 'BehaviorSubject'];
const OBSERVABLE_CREATOR_LIST = ['combineLatest', 'buffer'];

const buildWrapSubject = template.expression(`
__rxjsDebugRuntime.wrapSubject(TARGET, { label: LABEL })
`);

const buildWrapObservableCreator = template.expression(`
__rxjsDebugRuntime.wrapObservableCreator(combineLatest, { label: LABEL })
`);

const runtimeSnippet = template.statement(`
const __rxjsDebugRuntime = require('babel-plugin-rxjs-debug/lib/runtime');
`)();

class ChangeFlag {
  changed: boolean = false;

  mark(): void {
    this.changed = true;
  }
}

type State = {
  changeFlag: ChangeFlag;
  nameStack: string[];
  types: typeof types;
};

const visitor: Visitor<State> = {
  FunctionDeclaration(path, state) {
    const functionName = path.node.id?.name ?? '';
    const nameStack = [...state.nameStack, functionName];
    path.traverse(visitor, { ...state, nameStack });
  },
  ClassDeclaration(path, state) {
    const className = path.node.id?.name ?? '';
    const nameStack = [...state.nameStack, className];
    path.traverse(visitor, { ...state, nameStack });
  },
  Method(path, state) {
    const t = state.types;
    const methodName = t.isIdentifier(path.node.key)
      ? path.node.key.name
      : '[dynamic]';
    const nameStack = [...state.nameStack, methodName];
    path.traverse(visitor, { ...state, nameStack });
  },
  // const subject = new Subject();
  VariableDeclarator(path, state) {
    const t = state.types;
    if (!t.isIdentifier(path.node.id)) {
      return;
    }
    const variableName = path.node.id.name;

    if (
      !path.node.init ||
      !t.isNewExpression(path.node.init) ||
      !t.isIdentifier(path.node.init.callee) ||
      !SUBJECT_LIST.includes(path.node.init.callee.name)
    ) {
      return;
    }
    const target = path.node.init;

    const label = [...state.nameStack, variableName].join('.');
    const replaced = buildWrapSubject({
      TARGET: target,
      LABEL: t.stringLiteral(label),
    });
    path.node.init = replaced;
    state.changeFlag.mark();
  },
  // this.subject = new Subject();
  AssignmentExpression(path, state) {
    const t = state.types;
    if (
      !t.isMemberExpression(path.node.left) ||
      !t.isIdentifier(path.node.left.property)
    ) {
      return;
    }
    const memberName = path.node.left.property.name;

    if (
      !path.node.right ||
      !t.isNewExpression(path.node.right) ||
      !t.isIdentifier(path.node.right.callee) ||
      !SUBJECT_LIST.includes(path.node.right.callee.name)
    ) {
      return;
    }
    const target = path.node.right;

    const label = [...state.nameStack, memberName].join('.');
    const replaced = buildWrapSubject({
      TARGET: target,
      LABEL: t.stringLiteral(label),
    });
    path.node.right = replaced;
    state.changeFlag.mark();
  },
  // combineLatest([observable])
  CallExpression(path, state) {
    const t = state.types;
    if (!t.isIdentifier(path.node.callee)) {
      return;
    }
    const observableCreatorName = path.node.callee.name;
    if (!OBSERVABLE_CREATOR_LIST.includes(observableCreatorName)) {
      return;
    }

    const label = [...state.nameStack, observableCreatorName].join('.');
    const replaced = buildWrapObservableCreator({
      LABEL: t.stringLiteral(label),
    });
    path.node.callee = replaced;
    state.changeFlag.mark();
  },
};

export default ({ types: t }: { types: typeof types }): PluginObj => ({
  name: 'babel-plubin-rxjs-debug',
  visitor: {
    Program(path) {
      const changeFlag = new ChangeFlag();
      path.traverse(visitor, { changeFlag, nameStack: [], types: t });

      if (changeFlag.changed) {
        path.node.body.unshift(runtimeSnippet);
      }
    },
  },
});
