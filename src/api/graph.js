import request from '@/request'

export function getFullGraph(){
  return request({
    url: '/graph/all',
    method: 'get',
  })
}

export function getUserGraph(id){
  console.log('in getUserGraph', id)
  return request({
    url: `/graph/user/${id}`,
    method: 'get',
  })
}

export function saveSkill(graph){
  return request({
    url: '/graph/save/skill',
    method: 'post',
    data: graph
  })
}

export function saveAchievement(graph){
  return request({
    url: '/graph/save/achievement',
    method: 'post',
    data: graph
  })
}

// get skills by user
export function getSkills(id){
  return request({
    url: `/graph/skills/user/${id}`,
    method: 'get',
  })
}

// get achievements by user
export function getAchievements(id){
  return request({
    url: `/graph/achievements/user/${id}`,
    method: 'get',
  })
}

export function deleteAchievement(id){
  return request({
    url: '/graph/achievement/delete/'+id,
    method: 'post',
    data: id,
  })
}

export function deleteImage(id){
  return request({
    url: '/graph/image/delete/'+id,
    method: 'post',
    // data: id,
  })
}

export function deleteVideo(id){
  return request({
    url: '/graph/video/delete/'+id,
    method: 'post',
    data: {id},
  })
}

export function deleteSkill(id){
  return request({
    url: '/graph/skill/delete/'+id,
    method: 'post',
    data: id,
  })
}

export function saveGraph(graph){
  return request({
    url: '/graph/save',
    method: 'post',
    data: graph
  })
}

export function getNodeEdgeTypes(){
  return new Promise((resolve) => resolve({
    data: {
      node_types: ['user', 'skill', 'achievement', 'image', 'video', 'domain'],
      edge_types: ['user_skill', 'skill_achievement', 'user_achievement', 'achievement_image', 'achievement_video', 'skill_domain', 'achievement_domain', 'user_graduate'],
    }
  }))
  return request({
    url: '/graph/labels',
    method: 'get',
  })
}

export function getAllDomains(){
  return request({
    url: '/graph/domains/all',
    method: 'get',
  })
}

export function removeDomain(source_id, domain_id){
  return request({
    url: `/graph/domains/remove/${source_id}/${domain_id}`,
    method: 'post',
  })
}
