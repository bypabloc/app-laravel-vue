import { ref, computed } from 'vue'
import { useStore, mapState, mapActions } from 'vuex'

const useRegions = () => {

    const object = 'regions';

    const store = useStore();

    const limit = ref('all')  

    // dispatch -> actions
    // commit -> mutations

    console.log('useRegions')

    const getList = ( e ) => store.dispatch(`${object}/getList`, e )

    return {
        list: computed((e) => store.getters[`${object}/list`] ),
        listToSelect: computed((e) => store.getters[`${object}/listToSelect`] ),

        fetchingData: computed((e) => store.getters[`${object}/fetchingData`] ),
        errors: computed((e) => store.getters[`${object}/errors`] ),

        // Methods
        setParams: ( e ) => store.dispatch(`${object}/setParams`, e ),
        getList,
        // createTodo: ( text ) => store.commit('createTodo', text ),
    }
}

export default useRegions