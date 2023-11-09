(function () {
  // all the code goes here.
  // We cache these variables so that we dont have to keep refetching and reparsing resources.
  // This shell gets shared between Proposals and Commerce Insights on MSX so it helps
  // reduce load time after the first load. MSX's moduleloader reuses the same shell if
  // it detects two shells with the same name.
  let response;
  let html;
  let config;
  let scripts;
  let parsedDom;
  let content;
  let qcStyleOverride;
  let injectedElements = [];
  const domParser = new DOMParser();
  const currentUrl = new URL(window.location.href);

  const canLoadApp = () => {
    switch (currentUrl.host) {
      // Allow listed platforms
      case 'msxplatform.crm.dynamics.com':
      case 'msxsupportpoc.crm.dynamics.com':
        return true;
      default:
        return false;
    }
  };

  /**
   * Initial app setup
   */
  async function bindToDiv(container, context) {
    // Render coming soon for non-allow-listed domains.
    if (canLoadApp() === false) {
      const div = document.createElement('div');
      div.id = 'agreement-root';
      div.innerText = 'Coming Soon...';
      container.appendChild(div);
      return;
    }
    if (config == null) {
      config = await fetchConfig(context);
    }
    if (response == null || !response.ok) {
      // In case a user needs to test a local route within MSX, we can bind to
      // the window.proposals object and give it a LOCAL_URL to fetch.
      // (Alternatively, a dev could also overwrite their /etc/hosts)
      const baseUrl = new URL(config.baseUrl);
      response = await window.fetch(window.proposals?.LOCAL_URL ?? baseUrl.origin);
    }
    if (html == null) {
      html = await response.clone().text();
    }
    if (qcStyleOverride == null) {
      // When in QC show homegrown help instead of MSX help
      qcStyleOverride = document.createElement('style');
      qcStyleOverride.innerHTML = '#MSX_SupportPanel { display:none; }';
    }
    parsedDom = domParser.parseFromString(html, 'text/html');
    scripts = parsedDom.querySelectorAll('script');
    content = parsedDom.querySelector('#contentWrapper');
    container.appendChild(content);
    // Reset so that we dont continue to add tons of scripts to the DOM.
    injectedElements.forEach(script => script.remove());
    injectedElements = [];
    injectedElements.push(qcStyleOverride);
    document.head.appendChild(qcStyleOverride);
    scripts.forEach(script => {
      const newScript = document.createElement('script');
      [...script.attributes].map(attr => {
        // work around to test app locally
        if (attr.name === 'src') {
          var r = new RegExp('^(?:[a-z]+:)?//', 'i');
          if (!r.test(attr.value)) {
            attr.value = `${config.baseUrl}${attr.value}`
          }
        }
        return newScript.setAttribute(attr.name, attr.value)
      });
      newScript.textContent = script.textContent;
      injectedElements.push(newScript);
      document.body.appendChild(newScript);
    });
  }

  /**
   * Cleanup our resources to prevent memory leaks and other unexpected behavior
   */
  function unbindFromDiv(container) {
    if (canLoadApp()) {
      const root = container.querySelector('#contentWrapper');
      if (root != null) {
        // This uses Msx's version of ReactDOM since we do not have access to our version of React.
        // this shouldn't be a problem, but is worth noting.
        window.ReactDOM.unmountComponentAtNode(root);
      }

      // Remove agreement center application's root element and scripts
      container.querySelector('#contentWrapper')?.remove();
      injectedElements.forEach(script => script.remove());
    }
  }

  // Grabs the baseUrl from our web resource.
  // https://microsoftit.visualstudio.com/OneITVSO/_git/CSM-MSXPDS-PUX-PlatformSDK?path=/packages/msx-pcf-wrapper/Controls/Shared/MsxPortalPcfWrapperCommon.ts&version=GBmaster&line=87&lineEnd=98&lineStartColumn=2&lineEndColumn=6&lineStyle=plain&_a=contents
  async function fetchConfig(context) {
    let resp = await context.webAPI.retrieveMultipleRecords(
      'webresource',
      `?$filter=name eq '${context.parameters.configFileName.raw}'&$top=1`
    );
    return JSON.parse(atob(resp.entities[0].content));
  }

  /* Manage History between MSX and React Router */
  function manageHistory() {
    // Function that re-applies MSX History's state and additionally caches the URL that will be used on popstate
    function setMsxHistoryState(stateMutationArgs) {
      const state = stateMutationArgs[0];

      // Need to ensure that we only override state if its coming from React Router (has key and state)
      if ('key' in state && 'state' in state) {
        const msxHistoryState = { ...this.history.state };
        msxHistoryState.url = stateMutationArgs[2];
        stateMutationArgs[0] = msxHistoryState;
      }
    }

    // Need to ensure MSX's History state is written back when React Router calls pushState/replaceState
    window.history.pushState = new Proxy(window.history.pushState, {
      apply: (target, thisArg, argArray) => {
        setMsxHistoryState(argArray);
        return target.apply(thisArg, argArray);
      }
    });

    window.history.replaceState = new Proxy(window.history.replaceState, {
      apply: (target, thisArg, argArray) => {
        setMsxHistoryState(argArray);
        return target.apply(thisArg, argArray);
      }
    });

    // To ensure MSX loads the correct URL when back/forward is clicked re-load the state's correct URL
    window.addEventListener('popstate', (event) => {
      if (event && event.state && event.state.url) {
        this.history.replaceState(event.state, "", event.state.url);
      }
    });
  }

  function collapseNavBar() {
    const navBarContainer = document.querySelector(`[data-id='navbar-container']`);
    const isCollapsed = navBarContainer.classList.contains("smallscroll");
    if (!isCollapsed) {
      const msxLeftNavButton = document.querySelector(`[data-id="navbutton"]`);
      msxLeftNavButton.click();
    }
  }

  manageHistory();
  collapseNavBar();
  window["msx-agreement-shell"] = { bindToDiv, unbindFromDiv };
})();