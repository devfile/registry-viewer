import type, { Devfile } from 'customTypes'
import DevPageProjects from '@components/DevPageProjects'
import DevPageHeader from '@components/DevPageHeader'
import DevPageYAML from '@components/DevPageYAML'
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from 'next'

interface Path {
  params: { id: string }
}

/**
 * component that renders the individual devfile page for each type
 * @remarks
 *    stacks have header, starter projects, and yaml
 *    sample has header
 * 
 * @param devfile - index information for devile
 * @param devfileText - text of devile YAML, null when sample
 * @param devfileJSON -  json representation of devfile YAML, null when sample
 */
const Home = ({ devfile, devfileText, devfileJSON }: InferGetStaticPropsType<typeof getStaticProps>) => {
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
  const res: Response = await fetch('https://registry.devfile.io/index/all')
  const devfiles: Devfile[] = await res.json()
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
  const res: Response = await fetch('https://registry.devfile.io/index/all')
  const devfiles: Devfile[] = await res.json()
  const ids: string[] = devfiles.map((devfile) => {
    return devfile.name
  })
  const paths: Path[] = ids.map((id) => ({ params: { id: id } }))

  return {
    paths,
    fallback: false
  }
}
export default Home
