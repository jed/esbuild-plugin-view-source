export default (build, namespace = 'view-source') => ({
  name: namespace,
  setup({initialOptions, onLoad, onResolve}) {
    let options = {...initialOptions, write: false}
    let filter = new RegExp(`^${namespace}:`)

    onResolve({filter}, ({path, importer}) => {
      path = path.replace(filter, '')
      try { importer = new URL(importer) }
      catch (e) { importer = new URL(`${namespace}://${importer}`) }
      let {href, protocol, pathname} = new URL(path, importer)
      path = protocol === `${namespace}:` ? pathname : href
      return {namespace, path}
    })

    onLoad({filter: /.*/, namespace}, async ({path}) => {
      let result = await build({...options, entryPoints: [path]})
      let contents = JSON.stringify(result.outputFiles[0].text)
      return {contents, loader: 'json'}
    })
  }
})
