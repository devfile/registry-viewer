import type { Git, Project } from 'custom-types';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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
