import {
  addDataSource,
  getDataSources,
  removeDataSource,
} from './actions/manage-sources';

export default async function DataSourcesPage() {
  const sources = await getDataSources();

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="mb-8">
        <h1 className="mb-4 text-2xl font-bold">Data Sources</h1>

        <form
          action={addDataSource}
          className="space-y-4 rounded-lg bg-white p-4 shadow"
        >
          <div>
            <label
              htmlFor="alias"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Alias
            </label>
            <input
              id="alias"
              name="alias"
              type="text"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., project-docs"
            />
          </div>

          <div>
            <label
              htmlFor="path"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Directory Path
            </label>
            <input
              id="path"
              name="path"
              type="text"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., /path/to/documents"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Add Directory
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Alias
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Path
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {sources.map(source => (
              <tr key={source.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                  {source.alias}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  {source.path}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  {new Date(source.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                  <form
                    action={removeDataSource.bind(null, source.id)}
                    className="inline"
                  >
                    <button
                      type="submit"
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {sources.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No data sources added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
