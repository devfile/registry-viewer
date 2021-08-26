import styles from './DevfilePageProjects.module.css';
import type { Git, Project } from 'custom-types';
import { DevfilePageProjectDisplay } from '@src/components';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  Alert,
  AlertActionLink,
  AlertActionCloseButton,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardExpandableContent,
  Button,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import { useState } from 'react';

/**
 * type for errorAlert variable in {@link DevPageProjects}
 * specifically for catching errors in download
 *
 * @param name - name of alert
 * @param error - error that occurred
 * @param message - message to display
 * @param alertType - type of alert
 */
export interface ErrorAlert {
  name: string;
  error: string;
  message: string;
  alertType: 'warning' | 'danger';
}

/**
 * Representation of a Git source for  a starter project
 *
 * @param checkoutFrom - object with optional remote and revision keys
 *                       and specifies where project should be checked out
 * @param remote - remote name in remotes that should be used as the init and download url
 * @param revision - revision to checkout from
 * @param remotes - remotes map; should be init. to git project
 */

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

/**
 * props for {@link DevPageProjects}
 *
 * @param starterProjects - list of starter projects
 */
export interface DevfilePageProjectsProps {
  starterProjects: Project[];
}

export class UnsupportedLinkError extends Error {
  /**
   * error constructor with message 'Unsupported link: {@link link}'
   * @param link - unsupported link
   */
  public constructor(link: string) {
    super(`Attempted download with unsupported git repo link at ${link}`);
    this.name = 'UnsupportedLinkError ';
    Object.setPrototypeOf(this, UnsupportedLinkError.prototype);
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

export const DevfilePageProjects: React.FC<DevfilePageProjectsProps> = ({
  starterProjects
}: DevfilePageProjectsProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  const [selectedProject, setSelectedProject] = useState<Project>(starterProjects[0]);
  const [currentlyHoveredProject, setCurrentlyHoveredProject] = useState<Project | null>(null); // null when not hovering over project list

  const [errorAlert, setErrorAlert] = useState<null | ErrorAlert>(null);

  async function triggerDownload(project: Project): Promise<void> {
    setDownloading(true);
    await download(project).catch((error) => {
      if (error instanceof UnsupportedLinkError) {
        setErrorAlert({
          name: 'Unsupported Link',
          error: error.toString(),
          message: error.message,
          alertType: 'warning'
        });
      } else {
        setErrorAlert({
          name: 'Download Error',
          error: error.toString(),
          message:
            'Internal error has occurred during download. Please try again or report as issue. \n',
          alertType: 'danger'
        });
      }
    });
    setDownloading(false);
  }

  return (
    <Card data-testid="dev-page-projects" isExpanded={expanded} className={styles.card}>
      <CardHeader
        onExpand={(): void => setExpanded(!expanded)}
        isToggleRightAligned
        toggleButtonProps={{
          id: 'toggle-button',
          'aria-label': 'Details',
          'aria-labelledby': 'titleId toggle-button',
          'aria-expanded': expanded,
          'data-testid': 'toggle-button'
        }}
      >
        <CardTitle>Starter Projects</CardTitle>
      </CardHeader>
      <CardExpandableContent>
        <CardBody>
          <div className={styles.cardBody}>
            <div
              data-testid="projects-selector"
              className={styles.select}
              onMouseLeave={(): void => setCurrentlyHoveredProject(null)}
            >
              {
                /* starter projects list */
                starterProjects.map((project) => (
                  <div
                    key={project.name}
                    data-testid={`projects-selector-item-${project.name}`}
                    onMouseDown={(): void => setSelectedProject(project)}
                    onMouseEnter={(): void => setCurrentlyHoveredProject(project)}
                    className={
                      selectedProject.name === project.name ? styles.selected : styles.project
                    }
                  >
                    {project.name}
                  </div>
                ))
              }
            </div>
            <div className={styles.display}>
              <DevfilePageProjectDisplay project={currentlyHoveredProject || selectedProject} />
              <Button
                data-testid="download-button"
                className={styles.button}
                isLoading={downloading}
                onClick={(): Promise<void> => triggerDownload(selectedProject)}
                variant="tertiary"
              >
                Download
              </Button>
            </div>
          </div>
          {errorAlert && (
            <Alert
              variant={errorAlert.alertType}
              title={errorAlert.name}
              actionClose={<AlertActionCloseButton onClose={(): void => setErrorAlert(null)} />}
              actionLinks={
                <>
                  <AlertActionLink
                    onClick={(): Window | null =>
                      window.open(
                        `https://github.com/devfile/api/issues/new?assignees=&labels=&template=bug_report.md&title=Registry+Viewer+${errorAlert.name.replace(
                          ' ',
                          '+'
                        )}`
                      )
                    }
                  >
                    Report Issue to Github
                  </AlertActionLink>
                </>
              }
            >
              <TextContent className={styles.displayedProject}>
                <Text data-testid="alert-message">{errorAlert.message}</Text>
                {errorAlert.alertType !== 'warning' && (
                  <Text component={TextVariants.blockquote}>
                    <code>{errorAlert.error}</code>
                  </Text>
                )}
              </TextContent>
            </Alert>
          )}
        </CardBody>
      </CardExpandableContent>
    </Card>
  );
};
DevfilePageProjects.displayName = 'DevfilePageProjects';

/**
 * download subdirectory from root folder
 *
 *
 * @param url - zip url
 * @param subdirectory - name of subdirectory to extract from zip
 *
 * @throws Error
 *    thrown if error in download
 *
 */
export async function downloadSubdirectory(url: string, subdirectory: string): Promise<void> {
  const data = {
    url,
    subdirectory
  };
  const res = await fetch('/api/download-subdirectory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const status = res.status;
  if (status !== 200) {
    const errorJson = await res.json();
    throw new Error(errorJson.error);
  }

  const base64string = await res.text();
  const zip = await JSZip.loadAsync(base64string, { base64: true });
  try {
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `${subdirectory}.zip`);
  } catch (error) {
    throw new Error(error.text);
  }
}

/**
 * extract zip url from project git source
 *
 * @param git - git source of project, assumes github url of root directory of project
 *
 * @throws {@link TypeError}
 *      thrown if git remotes isn't configured properly
 *
 * @throws {@link UnsupportedLinkException}
 *      thrown if git repo is supported on an unsupported site
 */
export function getURLForGit(git: Git): string {
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
    url = `${url.replace('github.com', 'api.github.com/repos')}/zipball/`; // remove '.git' from link and convert to api zip link
  } else {
    throw new UnsupportedLinkError(url);
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
 * @throws {@link TypeError}
 *      thrown if git remotes isn't configured properly or if no url locations are found
 *
 * @throws {@link UnsupportedLinkError}
 *      thrown if git repo is supported on an unsupported site
 * @throws {@link Error}
 *      thrown if git repo is supported on an unsupported site
 */
export async function download(project: Project): Promise<void> {
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
