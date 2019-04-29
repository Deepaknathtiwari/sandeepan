const { Provider } = require('mobx-react/native');

const SPECIAL_REACT_KEYS = { children: true, key: true, ref: true };

export default class MobxRnnProvider extends Provider {
    props: {
        store: Object
    };

    context: {
        mobxStores: Object
    };

    getChildContext() {
        const stores = {};

        // inherit stores
        const baseStores = this.context.mobxStores;
        if (baseStores) {
            for (let key in baseStores) {
                // @ts-ignore
                stores[key] = baseStores[key];
            }
        }

        // add own stores
        for (let key in this.props.store) {
            // @ts-ignore
            if (!SPECIAL_REACT_KEYS[key]) {
                // @ts-ignore
                stores[key] = this.props.store[key];
            }
        }

        return {
            mobxStores: stores
        };
    }
}
