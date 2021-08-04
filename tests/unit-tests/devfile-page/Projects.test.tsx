/// <reference types='jest' />
import Projects, {
  download,
  downloadSubdirectory,
  getURLForGit
} from '../../../components/devfile-page/Projects';
import { Git, Project, UnsupportedLinkError } from '../../../components/devfile-page/Projects';
import { Alert, Button, CardExpandableContent } from '@patternfly/react-core';

import { mount, shallow } from 'enzyme';
import { ShallowWrapper } from 'enzyme';
import FileSaver from 'file-saver';
import fetch from 'jest-fetch-mock';
import JSZip from 'jszip';
import { act } from 'react-dom/test-utils';

/**
 * download
 *      project: git, zip
 *          git:
 *              checkOutFrom:
 *                  revision: specified, unspecified
 *                  remote: specified, unspecified
 *              remotes: single remote, multiple remotes
 *                  remote: supported git site, unsupported
 *                          valid link, invalid link
 *
 *          subDir?: existing in , non-existing in project
 *  getURLForGit
 *        same as above git
 *
 */
const testProjects: Array<{
  name: string;
  applyTo: Array<String>;
  project: Project;
  expectedURL: string;
}> = [
  {
    name: 'with single remote for git',
    applyTo: ['getURLForGit', 'download window'],
    project: {
      name: 'project1',
      git: {
        remotes: {
          git: 'https://github.com/odo-devfiles/springboot-ex.git'
        }
      }
    },
    expectedURL: 'https://api.github.com/repos/odo-devfiles/springboot-ex/zipball/'
  },
  {
    name: 'with multiple remotes and specified revision for git',
    applyTo: ['getURLForGit', 'download subdirectory'],
    project: {
      name: 'project2',
      description: 'this is a description',
      attributes: {
        attribute: 'this is an attribute'
      },
      git: {
        checkoutFrom: {
          remote: 'anotherGit',
          revision: '23.0.2.Final'
        },
        remotes: {
          git: 'https://github.com/odo-devfiles/springboot-ex.git',
          anotherGit: 'https://github.com/wildfly/quickstart'
        }
      },
      subDir: 'existing'
    },
    expectedURL: 'https://api.github.com/repos/wildfly/quickstart/zipball/23.0.2.Final'
  },
  {
    name: 'with zip and no subdirectory', // expected and project.zip.location should be same url
    applyTo: ['download window'],
    project: {
      name: 'project3',
      zip: {
        location:
          'https://code.quarkus.redhat.com/d?e=io.quarkus%3Aquarkus-resteasy&e=io.quarkus%3Aquarkus-smallrye-health&e=io.quarkus%3Aquarkus-openshift'
      }
    },
    expectedURL:
      'https://code.quarkus.redhat.com/d?e=io.quarkus%3Aquarkus-resteasy&e=io.quarkus%3Aquarkus-smallrye-health&e=io.quarkus%3Aquarkus-openshift'
  },
  {
    name: 'extra project', // expected and project.zip.location should be same url, extra for <Project /> test
    applyTo: [],
    project: {
      name: 'project4',
      description:
        'According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground.' +
        "The bee, of course, flies anyway because bees don't care what humans think is impossible. Yellow, black. Yellow, black. Yellow, black. Yellow, black.",
      zip: {
        location:
          'https://code.quarkus.redhat.com/d?e=io.quarkus%3Aquarkus-resteasy&e=io.quarkus%3Aquarkus-smallrye-health&e=io.quarkus%3Aquarkus-openshift'
      }
    },
    expectedURL:
      'https://code.quarkus.redhat.com/d?e=io.quarkus%3Aquarkus-resteasy&e=io.quarkus%3Aquarkus-smallrye-health&e=io.quarkus%3Aquarkus-openshift'
  }
];

const errorTestProjects: Array<{
  name: string;
  applyTo: Array<String>;
  project: Project;
  expected: Error;
}> = [
  {
    name: 'with multiple remotes and unspecified remote',
    applyTo: ['download', 'getURLForGit'],
    project: {
      name: 'project1',
      git: {
        remotes: {
          git: 'https://github.com/odo-devfiles/springboot-ex.git',
          anotherGit: 'https://github.com/wildfly/quickstart'
        }
      }
    },
    expected: new TypeError('Invalid git remotes')
  },
  {
    name: 'with unsupported git hosting site',
    applyTo: ['download', 'getURLForGit'],
    project: {
      name: 'project2',
      git: {
        remotes: {
          git: 'https://unsupported-site.com/odo-devfiles/springboot-ex.git'
        }
      }
    },
    expected: new UnsupportedLinkError('https://unsupported-site.com/odo-devfiles/springboot-ex')
  },
  {
    name: 'without zip/git',
    applyTo: ['download'],
    project: {
      name: 'project3'
    },
    expected: new TypeError('Invalid project has no zip/git url')
  }
];

describe('getURLForGit', () => {
  test.each(testProjects.filter((project) => project.applyTo.includes('getURLForGit')))(
    'url return tests',
    ({ project, expectedURL }) => {
      if (project.git !== undefined) {
        expect(getURLForGit(project.git)).toBe(expectedURL);
      } else {
        throw new TypeError('error with test inputs: should have git');
      }
    }
  );

  test.each(errorTestProjects.filter((project) => project.applyTo.includes('getURLForGit')))(
    'error tests: Git $name',
    ({ project, expected }) => {
      if (project.git !== undefined) {
        const git: Git = project.git;
        expect(() => getURLForGit(git)).toThrow(expected);
      } else {
        throw new TypeError('error with test inputs: should have git');
      }
    }
  );
});

/**
 * downloadSubdirectory
 *      url: valid url, invalid url
 *      subdirectory: existing subdirectory, non-existing subdirectory
 */

describe('downloadSubdirectory', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('error test: invalid url, fetch returns with 500 status', () => {
    const url = 'https://invalid.com/wildfly/quickstart/zipball/23.0.2.Final'; //technically these values don't matter
    const subdirectory = 'existing';

    checkForFetchError(() => downloadSubdirectory(url, subdirectory), url, subdirectory, {
      error: 'invalid url',
      status: 500
    });
  });

  test('error test: non existing subdirectory, fetch returns with 404 status', () => {
    const url = 'https://api.github.com/wildfly/quickstart/zipball/23.0.2.Final'; //technically these values don't matter
    const subdirectory = 'non-existing';

    checkForFetchError(() => downloadSubdirectory(url, subdirectory), url, subdirectory, {
      error: 'non existing subdirectory',
      status: 404
    });
  });

  test('valid fetch', () => {
    const url = 'https://stuk.github.io/jszip/test/ref/text.zip';
    const subdirectory = 'hello';
    checkForSuccessfulDownload(() => downloadSubdirectory(url, subdirectory), url, subdirectory);
  });
});

describe('download', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test.each(testProjects.filter((project) => project.applyTo.includes('download subdirectory')))(
    'Project $name , should call downloadSubdirectory',
    ({ project, expectedURL }) => {
      if (!project.subDir) {
        new TypeError('error with test inputs: should have key subDir');
      }
      const subdirectory = project.subDir ?? '';
      checkForSuccessfulDownload(() => download(project), expectedURL, subdirectory);
    }
  );

  test.each(testProjects.filter((project) => project.applyTo.includes('download window')))(
    'Project $name , should call window.open',
    ({ project, expectedURL }) => {
      const originalOpen = global.open;
      global.open = jest.fn();

      expect(download(project)).resolves.toBe(undefined);
      expect(global.open).toHaveBeenCalledWith(expectedURL);

      global.open = jest.fn(originalOpen);
    }
  );

  test.each(errorTestProjects.filter((project) => project.applyTo.includes('download')))(
    'error tests: Project $name',
    ({ project, expected }) => {
      expect(download(project)).rejects.toThrowError(expected);
    }
  );

  test('error tests: Project has non-existing subdirectory, fetch returns with 500 status', () => {
    const project: Project = {
      name: 'project2',
      git: {
        remotes: {
          git: 'https://github.com/odo-devfiles/springboot-ex.git'
        }
      },
      subDir: 'non-existing'
    };
    const subdirectory: string = project.subDir ?? '';
    const expectedURL = 'https://api.github.com/repos/odo-devfiles/springboot-ex/zipball/';

    checkForFetchError(() => download(project), expectedURL, subdirectory, {
      error: 'non existing subdirectory',
      status: 404
    });
  });

  test('error tests: Project has invalid url, fetch returns with 500 status', () => {
    const project: Project = {
      name: 'project2',
      zip: {
        location: 'https://invalid.com/wildfly/quickstart/zipball/23.0.2.Final'
      },
      subDir: 'non-existing'
    };
    const subdirectory: string = project.subDir ?? '';
    const expectedURL = project.zip?.location ?? '';

    checkForFetchError(() => download(project), expectedURL, subdirectory, {
      error: 'invalid url',
      status: 500
    });
  });
});

/**
 * starterProjects: empty list, non-empty list
 * displayed description and name:
 *      hovered project, selected project
 * download button:
 *      successful download, download that throws UnsupportedLinkError, download that throws other error
 */

describe('<Projects />', () => {
  let wrapper = shallow(
    <Projects starterProjects={testProjects.map((testProject) => testProject.project)} />
  );
  beforeEach(() => {
    wrapper = shallow(
      <Projects starterProjects={testProjects.map((testProject) => testProject.project)} />
    );
  });

  test('starterProjects prop set to empty list, check that HeaderTags is null', () => {
    wrapper.setProps({
      starterProjects: new Array(0)
    });

    expect(wrapper.type()).toEqual(null);
  });

  test('check that all projects are in selector', () => {
    const projectNames = testProjects.map((testProject) => testProject.project.name);
    const projectsWrappersList = wrapper.findWhere(
      (component) => component.prop('id') === 'projects-selector-item'
    );

    expect(projectsWrappersList.length).toBe(projectNames.length);

    projectNames.forEach((name) => {
      const projectWrappers = projectsWrappersList.findWhere((project) => project.key() === name);
      expect(projectWrappers.length).toBe(1);
      expect(projectWrappers.first().text()).toBe(name);
    });
  });

  test('check displayed description, mock selecting', () => {
    checkDisplayedDescription(wrapper, testProjects[1].project);
    checkDisplayedDescription(wrapper, testProjects[2].project);
  });

  test('check displayed description, mock selecting and hovering', () => {
    checkDisplayedDescription(wrapper, testProjects[1].project, testProjects[3].project);
    checkDisplayedDescription(wrapper, testProjects[2].project, testProjects[0].project);
  });

  test('check download on button click', async () => {
    const projectToDownload = testProjects[1];
    const wrapperMount = mount(<Projects starterProjects={[projectToDownload.project]} />);

    const mockZipBase64 =
      'UEsDBAoDAAAAAJx08Trj5ZWwDAAAAAwAAAAJAAAASGVsbG8udHh0SGVsbG8gV29ybGQKUEsBAhQDCgMAAAAAnHTxOuPllbAMAAAADAAAAAkAAAAAAAAAAAAggKSBAAAAAEhlbGxvLnR4dFBLBQYAAAAAAQABADcAAAAzAAAAAAA=';
    const spyFetch = fetch.mockResponseOnce(mockZipBase64, { status: 200 });
    const spyJSZip = jest.spyOn(JSZip.prototype, 'generateAsync').mockResolvedValue('blob');
    const spyFileSaver = jest.spyOn(FileSaver, 'saveAs').mockImplementation(jest.fn());

    // open expandable
    expect(wrapperMount.find(Button).simulate('click')).resolves;
    wrapperMount.update();

    await act(async () => {
      await wrapperMount.find(CardExpandableContent).find(Button).simulate('click');
      wrapperMount.update();

      expect(spyJSZip).toHaveBeenCalled();
      expect(spyFileSaver).toHaveBeenCalledWith('blob', 'existing.zip');
      expect(spyFetch).toHaveBeenCalled();

      // reset mocks
      spyJSZip.mockClear();
      spyFileSaver.mockClear();
    });
  });

  test('check download error alert', async () => {
    const wrapperMount = mount(
      <Projects starterProjects={errorTestProjects.map((testProject) => testProject.project)} />
    );

    // open expandable
    expect(wrapperMount.find(Button).simulate('click')).resolves;
    wrapperMount.update();

    await act(async () => {
      await wrapperMount.find(CardExpandableContent).find(Button).simulate('click');
      wrapperMount.update();

      expect(wrapperMount.find(Alert).length).toBe(1);
      expect(wrapperMount.find(Alert).prop('variant')).toBe('danger');
    });
  });

  test('check download UnsupportedLinkType alert', async () => {
    const projectToDownload = errorTestProjects[1];
    const wrapperMount = mount(<Projects starterProjects={[projectToDownload.project]} />);
    fetch.mockResponse(JSON.stringify({ error: projectToDownload.expected.message }), {
      status: 404
    });

    // open expandable
    expect(wrapperMount.find(Button).simulate('click')).resolves;
    wrapperMount.update();

    await act(async () => {
      await wrapperMount.find(CardExpandableContent).find(Button).simulate('click');
      wrapperMount.update();

      expect(wrapperMount.find(Alert).length).toBe(1);
      expect(wrapperMount.find(Alert).prop('variant')).toBe('warning');

      fetch.mockClear();
    });
  });
});

// helper functions

/**
 * mocks fetch call to /api/download-subdirectory with specified error and status and <br />
 * expects
 *  * specified error to be thrown in response to fetch
 *  * fetch to be called with /api/download-subdirectory, subdirectory, and url
 *
 * @param func - function to be called, should have call to downloadSubdirectory
 * @param url - url of project to download
 * @param subdirectory - subdirectory of project to download
 * @param error - error message for mock fetch to return
 * @param status - status number, should be a failed status number
 */
function checkForFetchError(
  func: () => void,
  url: string,
  subdirectory: string,
  fetchReturn: { error: string; status: number }
) {
  const spyFetch = fetch.mockResponseOnce(JSON.stringify({ error: fetchReturn.error }), {
    status: fetchReturn.status
  });

  expect(func()).rejects.toThrow(fetchReturn.error);
  expect(spyFetch).toHaveBeenCalledWith('/api/download-subdirectory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, subdirectory })
  });
  spyFetch.mockClear();
}

/**
 * mocks calls to download zip file and <br />
 * expects
 *  * fetch to be called with /api/download-subdirectory, subdirectory, and url
 *  * FileSaver.saveAs to be called with 'blob' and {@param subdirectory}.zip
 *  * generateAsync to be called on a ZipObject with
 * @param func - function to be called, should have call to downloadSubdirectory
 * @param url - expected url of project to download
 * @param subdirectory - expected subdirectory of project to download
 */
function checkForSuccessfulDownload(func: () => void, url: string, subdirectory: string) {
  const mockZipBase64 =
    'UEsDBAoDAAAAAJx08Trj5ZWwDAAAAAwAAAAJAAAASGVsbG8udHh0SGVsbG8gV29ybGQKUEsBAhQDCgMAAAAAnHTxOuPllbAMAAAADAAAAAkAAAAAAAAAAAAggKSBAAAAAEhlbGxvLnR4dFBLBQYAAAAAAQABADcAAAAzAAAAAAA=';

  // set spy functions
  const spyFetch = fetch.mockResponseOnce(mockZipBase64, { status: 200 });
  const spyJSZip = jest.spyOn(JSZip.prototype, 'generateAsync').mockResolvedValue('blob');
  const spyFileSaver = jest.spyOn(FileSaver, 'saveAs').mockImplementation(jest.fn());

  // check that spy functions were called
  expect(func())
    .resolves.toBe(undefined)
    .then(() => {
      expect(spyJSZip).toHaveBeenCalled();
      expect(spyFileSaver).toHaveBeenCalledWith('blob', subdirectory + '.zip');
      expect(spyFetch).toHaveBeenCalledWith('/api/download-subdirectory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, subdirectory })
      });
    });

  // reset mocks
  spyJSZip.mockClear();
  spyFileSaver.mockClear();
}

/**
 * Simulates hover on {@param hoverProject} if present and simulates select on {@param selectProject}
 * and checks for correct displayed project name and
 * @param wrapper - wrapper of {@Project component}
 * @param selectProject - project to simulate select
 * @param hoverProject - project to simulate hover
 */
function checkDisplayedDescription(
  wrapper: ShallowWrapper,
  selectProject: Project,
  hoverProject?: Project
) {
  wrapper.findWhere((component) => component.key() === selectProject.name).simulate('click');
  wrapper.update();

  if (hoverProject) {
    wrapper.findWhere((component) => component.key() === hoverProject.name).simulate('mouseEnter');
    wrapper.update();
  }

  let displaySelectedProjectNameWrapper = wrapper.findWhere(
    (component) => component.prop('id') === 'display-selected-project-name'
  );
  let displaySelectedProjectDisplayWrapper = wrapper.findWhere(
    (component) => component.prop('id') === 'display-selected-project-description'
  );

  let displayHoveredProjectNameWrapper = wrapper.findWhere(
    (component) => component.prop('id') === 'display-hovered-project-name'
  );
  let displayHoveredProjectDisplayWrapper = wrapper.findWhere(
    (component) => component.prop('id') === 'display-hovered-project-description'
  );

  expect(displaySelectedProjectNameWrapper.length).toBe(hoverProject ? 0 : 1);
  expect(displaySelectedProjectDisplayWrapper.length).toBe(hoverProject ? 0 : 1);

  expect(displayHoveredProjectNameWrapper.length).toBe(hoverProject ? 1 : 0);
  expect(displayHoveredProjectDisplayWrapper.length).toBe(hoverProject ? 1 : 0);
}
