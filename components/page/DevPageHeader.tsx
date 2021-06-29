import { Devfile } from 'custom-types'
import mainPageLogo from '../../public/images/mainPageLogo.svg'
import HeaderTags from "./HeaderTags"
import {
    Brand,
    Card,
    CardBody,
    Label
  } from '@patternfly/react-core'

/**
 * props for devpage metadata header 
 * @param devfile - devfile index information
 * @param metadata - metadata from 
 */
interface Props {
    devfile:Devfile,
    metadata?:Record<string, string>
}

/**
 * header that displays basic information and metadata information for respective devfile
 * @param devfile - index information for devfie
 * @param metadata - metadata information from devfile yaml
 */
const DevPageHeader = ({devfile, metadata}:Props) => {
    const metaInclude = new Array('projectType', 'version', 'language' ) // types to include in metadata from index

    return (
        <Card 
            isRounded
            style ={{width:"75%", maxWidth:"1000px", margin:"auto", marginTop:"30px", marginBottom:"30px"}}>
            <CardBody style={{width:"100%"}}>
                <div style={{display:"flex", width:"100%"}}>
                    <div style={{display:"flex", width:"50%", borderRight:"2px solid #ADABAE"}}>
                        <div style={{margin:"10px"}}>
                        <Brand
                            src={devfile.icon || mainPageLogo}
                            alt=""
                            className="h-10"
                        />
                            <h3 style={{color: "#ADABAE",marginLeft:"auto",marginRight:"auto"}}>{devfile.type}</h3>
                        </div>
                        <div style={{margin:"10px"}}>
                            <h1 style={{fontSize:"22px", margin:"0.5rem"}}>{devfile.displayName}</h1>
                            <p style={{margin:"0.5rem"}}>&emsp;{devfile.description}</p>
                            <HeaderTags tags={devfile.tags}/>
                        </div>
                    </div>
                    <div style={{width:"50%", margin:"2%"}}>
                            {Object.entries(devfile).map(([key,value]) => { 
                                    if(metaInclude.includes(key)){
                                            const label= key.replace(/([a-z](?=[A-Z]))/g, '$1 ').toLowerCase() //split camel case up 
                                            return (<p><strong>{label+": "}</strong>{value}</p>)
                                    }
                                })}
                            {(metadata)? //include website if stack; include git if sample
                                (metadata['website'])&&<p><strong>website: </strong><a href={metadata['website']} target="_blank">{metadata['website']}</a></p>:
                                (devfile.git)&&<a href={devfile.git.remotes[Object.keys(devfile.git.remotes)[0]]} target="_blank">view git repository</a>
                            }
                    </div>
                </div>
            </CardBody>

        </Card>

    )
}
export default DevPageHeader