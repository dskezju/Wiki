import { getAllDomains } from "@/api/graph";

const user = {
  state:{
    domain2name: {},
    domains: [],
  },
  mutations: {
    SET_DOMAINS: (state, domains) => {
      state.domains = domains
    },
    SET_DOMAIN2NAME: (state, domain2name) => {
      state.domain2name = domain2name
    },
  },
  actions: {
    getDomains({commit}){
      return new Promise((resolve, reject) => {
        getAllDomains().then((data) => {
          commit('SET_DOMAINS', data.data)

          let domain2name = {}
          data.data.map((item) => {
            domain2name[parseInt(item.id)] = item.properties.name
          })
          commit('SET_DOMAIN2NAME', domain2name)
          resolve(data)
        }).catch(err => reject(err))
      })
    },
  }
};

export default user;
