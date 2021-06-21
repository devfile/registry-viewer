import {
    Card,
    CardBody,
    CodeBlock,
    CodeBlockCode,
    CardHeader
  } from '@patternfly/react-core'

/**
 * props for DevFile YAML component
 * 
 * @param devYAML - yaml text with /n for each new line
 */
interface Props {
    devYAML:string
}
/**
 * component  for displaying DevFile YAML
 * 
 * @remarks
 *      component only for stacks, won't be present for samples
 * 
 * @param props - yaml text
 */
const DevPageYAML = ({devYAML}:Props) => {
    return (
        <Card 
            isRounded
            style ={{width:"75%", maxWidth:"1000px", margin:"auto", marginTop:"30px", marginBottom:"30px"}}>
            <CardHeader style={{padding:"10px", textAlign:"center"}}>
                devfile.yaml
            </CardHeader>            
            <CardBody style={{padding:"0"}}>
            <CodeBlock style={{backgroundColor:"#1F1F20", color:"#FFFFFF"}}> 
                    {/*codeblock rendered with mapping st each line in the yaml file has a corresponding index that is unselectable by user*/}
                    <CodeBlockCode id="code-content">{devYAML.split("\n").map((line, index) => <div style={{display:"flex"}}> 
                                                                                            <div style={{width:"40px", userSelect:"none", color:"#ADABAE"}}>{index+1}</div>
                                                                                            <p style={{ width:"95%"}}>{line}</p>
                                                                                        </div>)}
                    </CodeBlockCode>
            </CodeBlock>
                
            </CardBody>

        </Card>
        

    )
}
export default DevPageYAML