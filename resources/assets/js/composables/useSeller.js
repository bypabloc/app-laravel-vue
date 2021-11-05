import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const useSeller = () => {

    const object = 'seller';

    const store = useStore();

    // dispatch -> actions
    // commit -> mutations

    console.log('useSeller')

    const getList = ( e ) => store.dispatch(`${object}/getList`, e )

    return {
        fetchingData: computed((e) => store.getters[`${object}/fetchingData`] ),
        errors: computed((e) => store.getters[`${object}/errors`] ),

        // Methods
        formFirstValidate: ( e ) => store.dispatch(`${object}/formFirstValidate`, e ),
        formSecondValidate: ( e ) => store.dispatch(`${object}/formSecondValidate`, e ),
        inscriptionNew: ( e ) => store.dispatch(`${object}/inscriptionNew`, e ),
        inscriptionSavePassword: ( e ) => store.dispatch(`${object}/inscriptionSavePassword`, e ),
        setFetchingData: ( e ) => store.dispatch(`${object}/setFetchingData`, e ),
        getList,
        // createTodo: ( text ) => store.commit('createTodo', text ),

        userUuidValidate: ( e ) => store.dispatch(`${object}/userUuidValidate`, e ),
    }
}

export default useSeller