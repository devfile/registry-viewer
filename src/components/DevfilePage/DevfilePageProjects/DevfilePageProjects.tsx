import styles from './DevfilePageProjects.module.css';
import type { Project, DefaultProps, Devfile } from 'custom-types';
import { DevfilePageProjectDisplay } from '@src/components';
import { getUserRegion } from '@src/util/client';
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
  TextVariants,
} from '@patternfly/react-core';
import { useState } from 'react';
import { useRouter } from 'next/router';
import getConfig from 'next/config';

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
 * props for {@link DevPageProjects}
 *
 * @param starterProjects - list of starter projects
 */
export interface DevfilePageProjectsProps extends DefaultProps {
  devfile: Devfile;
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

export const DevfilePageProjects: React.FC<DevfilePageProjectsProps> = ({
  devfile,
  starterProjects,
  analytics,
}: DevfilePageProjectsProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  const [selectedProject, setSelectedProject] = useState<Project>(starterProjects[0]);
  const [currentlyHoveredProject, setCurrentlyHoveredProject] = useState<Project | null>(null); // null when not hovering over project list

  const [errorAlert, setErrorAlert] = useState<null | ErrorAlert>(null);

  const router = useRouter();

  async function downloadStarterProject(devfile: Devfile, project: Project): Promise<void> {
    setDownloading(true);

    try {
      window.open(`${devfile.registryLink}/starter-projects/${project.name}`);

      if (analytics) {
        const region = getUserRegion(router.locale);
        const { publicRuntimeConfig } = getConfig();

        analytics.track(
          'Starter Project Downloaded',
          {
            client: publicRuntimeConfig.segmentClientId,
            devfile: devfile.name,
            starterProject: project.name,
          },
          {
            context: { ip: '0.0.0.0', location: { country: region } },
            userId: analytics.user().anonymousId(),
          },
        );
      }
    } catch (error) {
      setErrorAlert({
        name: 'Download Error',
        error: (error as Error).toString(),
        message:
          'Internal error has occurred during download. Please try again or report as issue. \n',
        alertType: 'danger',
      });

      if (analytics) {
        const region = getUserRegion(router.locale);
        const { publicRuntimeConfig } = getConfig();

        analytics.track(
          'Starter Project Download Failed',
          {
            client: publicRuntimeConfig.segmentClientId,
            devfile: devfile.name,
            starterProject: project.name,
          },
          {
            context: { ip: '0.0.0.0', location: { country: region } },
            userId: analytics.user().anonymousId(),
          },
        );
      }
    }

    setDownloading(false);
  }

  return (
    <Card data-testid="dev-page-projects" isExpanded={expanded} className={styles.card}>
      <CardHeader
        data-testid="toggle-button"
        onClick={(): void => setExpanded(!expanded)}
        isToggleRightAligned
        className={styles.cardHeader}
        toggleButtonProps={{
          id: 'toggle-button',
          'aria-label': 'Details',
          'aria-labelledby': 'titleId toggle-button',
          'aria-expanded': expanded,
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
              {starterProjects.map((project) => (
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
              ))}
            </div>
            <div className={styles.display}>
              <DevfilePageProjectDisplay project={currentlyHoveredProject || selectedProject} />
              <Button
                data-testid="download-button"
                className={styles.button}
                isLoading={downloading}
                onClick={(): Promise<void> => downloadStarterProject(devfile, selectedProject)}
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
                          '+',
                        )}`,
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
