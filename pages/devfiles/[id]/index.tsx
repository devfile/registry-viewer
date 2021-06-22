import { Devfile } from 'custom-types'
import DevPageProjects from '@components/page/DevPageProjects'
import DevPageHeader from '@components/page/DevPageHeader'
import DevPageYAML from '@components/page/DevPageYAML'

import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from 'next'

interface Path {
  params: { id: string }
}

/**
 * Renders the {@link DevfilePage}
 * @remarks
 *    stacks have header, starter projects, and yaml
 *    sample has header
 * 
 * @param devfile - index information for devile
 * @param devfileText - text of devile YAML, null when sample
 * @param devfileJSON -  json representation of devfile YAML, null when sample
 */
const DevfilePage = ({ devfile, devfileText, devfileJSON }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div style={{alignContent:"center", minHeight:"100vh"}}>
      {devfile.type==="stack"?(
          <div>
            <DevPageHeader metadata={devfileJSON.metadata} devfile={devfile}/>
            <DevPageProjects starterProjects ={devfileJSON.starterProjects}/>
            <DevPageYAML devYAML={devfileText}/>
          </div>
      ):
      <DevPageHeader devfile={devfile}/>
      }
    </div>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const res: Response = await fetch('https://registry.devfile.io/index/all?icon=base64')
  const devfiles: Devfile[] = await res.json() as Devfile[]
  const devfile: Devfile = (devfiles.find((devfile: Devfile) => {
    return devfile.name === context.params?.id
  })!)

  var res2: Response
  var devfileText:string|null =null  
  var devfileJSON = null

  if(devfile.type==='stack'){
    res2 =  await fetch('https://registry.devfile.io/devfiles/'+devfile.name,{
                        headers: {'Accept-Type':'text/plain'}})
    devfileText= await res2.text()

    //convert yaml to json
    const yaml = require('js-yaml');
    devfileJSON= yaml.load(devfileText);
  }
  

  return {
    props: {
      devfile,
      devfileText,
      devfileJSON

    },
    revalidate: 21600 // Regenerate page every 6 hours
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res: Response = await fetch('https://registry.devfile.io/index/all?icon=base64')
  const devfiles: Devfile[] = await res.json() as Devfile[]
  const ids: string[] = devfiles.map((devfile) => {
    return devfile.name
  })
  const paths: Path[] = ids.map((id) => ({ params: { id: id } }))

  return {
    paths,
    fallback: false
  }
}

export default DevfilePage
