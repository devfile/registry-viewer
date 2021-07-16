import styles from './devPage.module.css';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardExpandableContent,
  Button,
  Text,
  TextContent
} from '@patternfly/react-core';
import { useState } from 'react';

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
  checkoutFrom?: {
    remote?: string;
    revision?: string;
  };
  remotes: Record<string, string>;
}

/**
 * Representation of a single starter project
 *
 * @remarks
 *  For more details, check out the devfile API reference at https://docs.devfile.io/devfile/2.1.0/user-guide/api-reference.html
 *
 * @param name - name of starter project
 * @param description - description of starter project
 * @param git - git source of starter project
 * @param zip - zip source of start project with key location
 * @param location - zip project's source location address
 * @param subDir - subdirectory of zip to be used as the root for the starter project
 */
interface Project {
  name: string;
  description?: string;
  git?: Git;
  zip?: {
    location: string;
  };
  subDir?: string;
}

/**
 * props for {@link DevPageProjects}
 *
 * @param starterProjects - list of starter projects
 */
interface Props {
  starterProjects: Project[];
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

const DevPageProjects = ({ starterProjects }: Props) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  const [selectedProject, setSelectedProject] = useState<Project>(starterProjects[0]);
  const [currentlyHoveredProject, setCurrentlyHoveredProject] = useState<Project | null>(null); // null when not hovering over project list

  async function triggerDownload(project: Project) {
    setDownloading(true);
    await download(project);
    setDownloading(false);
  }

  return (
    <Card
      id="card1"
      isExpanded={expanded}
      isRounded
      style={{
        width: '75%',
        maxWidth: '1000px',
        margin: 'auto',
        marginTop: '30px',
        marginBottom: '30px'
      }}
    >
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
          <div style={{ display: 'flex', width: '100%' }}>
            <div
              className={styles.select}
              style={{
                width: '50%',
                alignItems: 'center',
                height: '10rem',
                overflowY: 'scroll',
                order: 0
              }}
              onMouseLeave={() => setCurrentlyHoveredProject(null)}
            >
              {
                /* starter projects list */
                starterProjects.map((project) => (
                  <div
                    key={project.name}
                    id={project.name}
                    style={{ width: '95%' }}
                    onMouseDown={() => setSelectedProject(project)}
                    onMouseEnter={() => setCurrentlyHoveredProject(project)}
                    className={
                      selectedProject.name === project.name ? styles.selected : styles.project
                    }
                  >
                    {project.name}
                  </div>
                ))
              }
            </div>

            <div
              style={{
                width: '40%',
                alignItems: 'center',
                marginLeft: 'auto',
                marginRight: 'auto',
                order: 0
              }}
            >
              {!currentlyHoveredProject ? ( // sets displayed project description
                <div style={{ width: '80%', padding: 'auto', margin: '10px' }}>
                  <TextContent>
                    <Text style={{ margin: '0px' }}>{selectedProject.name}</Text>
                    <Text style={{ color: '#ADABAE' }}>{selectedProject.description}</Text>
                  </TextContent>
                </div>
              ) : (
                <div style={{ width: '80%', padding: 'auto', margin: '10px' }}>
                  <TextContent>
                    <Text style={{ margin: '0px' }}>{currentlyHoveredProject.name}</Text>
                    <Text style={{ color: '#ADABAE' }}>{currentlyHoveredProject.description}</Text>
                  </TextContent>
                </div>
              )}
              <div style={{ display: 'flex', alignContent: 'center' }}>
                <Button
                  className={styles.button}
                  isLoading={downloading}
                  onClick={() => triggerDownload(selectedProject)}
                  variant="tertiary"
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </CardExpandableContent>
    </Card>
  );
};

/**
 * download subdirectory from root folder
 *
 *
 * @param url - zip url
 * @param subdirectory - name of subdirectory to extract from zip
 *
 * @throws Error
 *    thrown if error in download
 */
async function downloadSubdirectory(url: string, subdirectory: string) {
  const data = {
    url,
    subdirectory
  };
  const response = await fetch('/api/download-subdirectory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const status = response.status;
  if (status !== 200) {
    const errorJson = await response.json();
    throw new Error(errorJson);
  }

  const base64string = await response.text();
  const zip = await JSZip.loadAsync(base64string, { base64: true });

  try {
    await zip.generateAsync({ type: 'blob' }).then(
      function (blob) {
        saveAs(blob, subdirectory + '.zip');
      },
      function (err) {
        throw err;
      }
    );
  } catch (error) {
    throw Error(error.text);
  }
}

/**
 * extract zip url from project git source
 *
 * @param git - git source of project, assumes github url of root directory of project
 *
 * @throws TypeError
 *      thrown if git remotes isn't configured properly or git link isn't supported yet
 */
function getURLForGit(git: Git) {
  let url = '';
  const keys = Object.keys(git.remotes);

  if (keys.length === 1) {
    url = git.remotes[keys[0]];
  } else if (git.checkoutFrom && git.checkoutFrom.remote) {
    // should always be true if keys.length!=1
    url = git.remotes[git.checkoutFrom.remote];
  } else {
    throw new TypeError('Invalid git remotes');
  }

  if (url.match(new RegExp('[.]git$'))) {
    url = url.slice(0, url.length - 4);
  }

  if (url.match(new RegExp('github[.]com'))) {
    url = url.replace('github.com', 'api.github.com/repos') + '/zipball/'; // remove ".git" from link and convert to api zip link
  } else {
    throw new TypeError('Unsupported link type: ' + url);
  }

  if (git.checkoutFrom && git.checkoutFrom.revision) {
    url += git.checkoutFrom.revision;
  }
  return url;
}

/**
 * download project as a zip file as specified version and subdirectory
 * @param project - project to download
 *
 * @throws TypeError
 *      thrown if no url locations are found
 */
async function download(project: Project) {
  let url: string;
  if (project.git) {
    // for git
    url = getURLForGit(project.git);
  } else if (project.zip && project.zip.location) {
    // for zip
    url = project.zip.location;
  } else {
    throw new TypeError('Invalid project has no zip/git url');
  }

  if (project.subDir) {
    await downloadSubdirectory(url, project.subDir);
  } else {
    window.open(url);
  }
}

export default DevPageProjects;
