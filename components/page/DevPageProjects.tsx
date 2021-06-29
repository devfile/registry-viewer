import styles from '@components/page/devpage.module.css'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    CardExpandableContent,
    Button
  } from '@patternfly/react-core'
import { useState } from 'react'

/*
    component for starter projects dropdown 
*/

/**
 * Representation of a Git source for  a starter project
 *
 * @param checkoutFrom - object with optional remote and revision keys 
 *                       and specifies where project should be checked out
 * @param remote - remote name in remotes that should be used as the init and download url
 * @param revision - revision to checkout from
 * @param remotes - remotes map; should be init. to git project
 */
interface Git {
    checkoutFrom?:{
        remote?:string,
        revision?:string
    },
    remotes:Record<string,string>
}

/**
 * Representation of a single starter project
 * 
 * @remarks
 *  For more details, check out the devfile API reference at https://docs.devfile.io/devfile/2.1.0/user-guide/api-reference.html
 * 
 * @param name - name of starter project
 * @param description: description of starter project
 * @param git - git source of starter project
 * @param zip - zip source of start project with key location
 * @param location - zip project's source location address
 * @param subDir - subdirectory of zip to be used as the root for the starter project
 */
interface Project { 
    name:string,
    description?:string,
    git?:Git,
    zip?:{
        location:string
    },
    subDir?:string
}

/**
 * props for start projects dropdown component
 * 
 * @param starterProjects list of starter projects
 */
interface Props { 
    starterProjects: Project[]
}

async function downloadSubdirectory(url:string, subDir:string){
    const response = await fetch('/api/download_project',{

        method:"POST",
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({url:url, subdirectory:subDir})
    })
    const base64string = await response.text()
    let zip = await JSZip.loadAsync(base64string, {base64:true})

    await zip.generateAsync({type:"blob"}).then(function (blob) { 
        saveAs(blob, subDir+ ".zip");                          
    }, function (err) {
        jQuery("#blob").text(err);
    });

}

/**
 * extract zip url from project git source
 * 
 * @param git - git source of project, assumes github url of root directory of project
 * 
 * @throws TypeError 
 *      thrown if git remotes isn't configured properly
 */
function getURLForGit(git:Git){
    var url = ""
    const keys = Object.keys(git.remotes)

    if(keys.length===1){
        url = git.remotes[keys[0]]

    } else if(git.checkoutFrom&&git.checkoutFrom.remote) {//should always be true if keys.length!=1
        url=git.remotes[git.checkoutFrom.remote]

    } else {
        throw new TypeError("Invalid git remotes")
    }

    if(url.includes(".git"))
        url = url.slice(0,url.length-4)

    url = url.replace("github.com","api.github.com/repos") +"/zipball/" //remove ".git" from link and convert to api zip link

    if(git.checkoutFrom&&git.checkoutFrom.revision){
        url += git.checkoutFrom.revision
    }
    return url
}

/**
 * download project as a zip file as specified versioon and subdirectory
 * @param project 
 * 
 * @throws TypeError
 *      thrown if no url locations are found
 */
async function download(project:Project){ 
    let url:string
    if(project.git){ //for git
        url = getURLForGit(project.git)

    } else if (project.zip&& project.zip.location){ //for zip
        url = project.zip.location

    } else { 
        throw  new TypeError("Invalid project has no zip/git url")
    }

    if(project.subDir){
        await downloadSubdirectory(url, project.subDir)
    } else{
        window.open(url)
    }
    
}

/**
 * component for expandable starter project select with functionality to download
 * 
 * @remarks
 *      when hovering, should display hovered project description
 *      when not hovering, should display selected project description
 *      component only for stacks, won't be present for samples
 * 
 * @param starterProjects - starter projects associated with respective devfile
 */

const DevPageProjects= ({starterProjects}:Props) => {

    const [expanded, setExpanded] = useState<boolean>(false)
    const [downloading, setDownloading] = useState<boolean>(false)

    const [selectedProject, setSelectedProject] = useState<Project>(starterProjects[0])
    const [currentlyHoveredProject, setCurrentlyHoveredProject] = useState<Project|null>(null) //null when not hovering over project list


    async function triggerDownload(project:Project){
        setDownloading(true)
        await download(project)
        setDownloading(false)
    }
    
  return (
      <Card id="card1" 
        isExpanded={expanded}
        isRounded
        style ={{width:"75%", maxWidth:"1000px", margin:"auto", marginTop:"30px", marginBottom:"30px"}}>
          <CardHeader
            onExpand={() => setExpanded(!expanded)}
            isToggleRightAligned
            toggleButtonProps={{
              id: 'toggle-button',
              'aria-label': 'Details',
              'aria-labelledby': 'titleId toggle-button',
              'aria-expanded': expanded
            }}
          >
            <CardTitle id="titleId">Starter Projects</CardTitle>
          </CardHeader>
          <CardExpandableContent>
            <CardBody>
                <div style={{display:"flex", width:"100%"}}>

                    <div className= {styles.select} style = {{width:"50%", alignItems:"center", height:"10rem", overflowY:"scroll", order:0 }}
                        onMouseLeave ={() => setCurrentlyHoveredProject(null)}>
                        {starterProjects.map((project) => //starter projects list
                        (<div 
                            id ={project.name}
                            style={{width:"95%"}}
                            onMouseDown={() => (setSelectedProject(project))}
                            onMouseEnter ={() => setCurrentlyHoveredProject(project)}
                            className={(selectedProject.name===project.name)?styles.selected:styles.project}>
                            {project.name}
                        </div>))
                    }
                    </div>

                    <div style = {{width:"40%", alignItems:"center",marginLeft:"auto", marginRight:"auto", order:0}}>
                        {!currentlyHoveredProject? //sets displayed project description
                            (<div style = {{width:"80%",  padding:"auto", margin:"10px"}}>
                                <h6>{selectedProject.name}</h6>
                                <p style={{color:"#ADABAE"}}>{selectedProject.description}</p>
                            </div>):
                            (<div style = {{width:"80%",  padding:"auto", margin:"10px"}}>
                                <h6>{currentlyHoveredProject.name}</h6>
                                <p style={{color:"#ADABAE"}}>{currentlyHoveredProject.description}</p>
                            </div>)}
                            <div style={{display:"flex", alignContent:"center"}}>
                                <Button className={styles.button} isLoading={downloading} onClick={e => triggerDownload(selectedProject)} variant="tertiary" >download</Button>
                            </div>
                            
                    </div>
                </div>
            </CardBody>
          </CardExpandableContent>
        </Card>
  )
}
export default DevPageProjects