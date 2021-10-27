import {saveAchievement, removeDomain} from '@/api/graph'
import { ElMessage } from 'element-plus'

export function deal_media(graph, media, label, edge_label, achieve_id, fake_id){
  console.log('in deal_media')
  for(let i in media){ //处理图片，图片为单独节点
    console.log(i, typeof(i))
    console.log('media[i]:', media[i])
    let isNew = media[i].id ? false : true
    console.log('isNew:', isNew)
    let media_id = media[i].id || ++fake_id //不要忘记++

    graph.nodes.push({
      id: media_id,
      isNew: isNew,
      label,
      properties: {
        url: media[i].properties.url,
        index: parseInt(i)+1, //图片的顺序，这个i居然是string
      }
    })
    graph.edges.push({ //成果指向图片
      startNodeId: achieve_id,
      endNodeId: media_id,
      label: edge_label,
      properties: {
        name: edge_label
      }
    })
  }
  return fake_id
}

// domains必须是id的集合
export function add_achievement(graph, achieve, fake_id, isNew, i, domains){
  let achieve_id = isNew ? ++fake_id : achieve.id
  graph.nodes.push({ //成果节点
    id: achieve_id,
    isNew: isNew,
    label: 'achievement',
    properties: {
      ...achieve.properties,
      create_time: new Date(), //成果的顺序
    },
  })
  for(let domain_id of domains){ // achievement -> domain
    graph.edges.push({ //可以这样因为后台规定两个节点间一个type的edge只能有一条
      startNodeId: achieve_id,
      endNodeId: domain_id,
      label: 'achievement_domain',
      properties: {
        name: 'achievement_domain',
      }
    })
  }
  return fake_id
}

export async function submit_achievements(achievements){
  let graph = {nodes: [], edges: []}
  let fake_id = 1e8 // fake_id要保证不与真实的id重复
  if(achievements){
    for(let i in achievements){
      let achieve = achievements[i]
      console.log(achieve)
      if(!achieve.properties.title.trim()){
        ElMessage({
          type: 'error',
          message: '成果标题不能为空'
        })
        return
      }

      for(let domain_id of achieve.ori_domains){ //比较不同，放弃的domain就移除
        if(achieve.domains.indexOf(domain_id) === -1){
          removeDomain(achieve.id, domain_id) //如果ori_domains不为空，则一定不是新的achievement
        }
      }

      //这里achieve的domains就是achieve.domains，因为在achievementFormItem里是直接修改achieve.domains
      fake_id = add_achievement(graph, achieve, fake_id, achieve.id ? false : true, i, achieve.domains)
      //处理图片和视频，单独成节点
      let achieve_id = achieve.id || fake_id
      fake_id = deal_media(graph, achieve.imgs, 'image', 'achievement_image', achieve_id, fake_id)
      fake_id = deal_media(graph, achieve.videos, 'video', 'achievement_video', achieve_id, fake_id)
    }
  }
  console.log('graph:', graph)
  //保证保存完之后再返回
  await saveAchievement(graph).then(() => ElMessage({type: 'success', message: 'success!'}))
    .catch((err) => ElMessage({type: 'error', message: err}))
}
