import { InstanceCache } from 'blocks/utilities/instanceCache';
import { ArgsError } from 'blocks/utilities/error';
import { convertToSeoSlug } from 'utils';

/**
 * A content configuration (i.e. the data and metadata from a content/configs JSON file).
 */
export class CollectionConfig {
  /**
   * Create a content configuration from the JSON data given.
   * @param {object} config - Content configuration data. Must contain:
   *   - `name` - The name of the configuration.
   *   - `dirName` - Directory for the content source.
   *   - `snippetPath` - Directory for snippets inside the content source.
   *   - `featured` - > 0 if the content is listed, -1 if it's not.
   *   - `repoUrl` - Base url for the GitHub repository.
   *   - `slug` - Base url for the content pages.
   * @throws Will throw an error if any of the necessary keys is not present.
   */
  constructor({
    name,
    slug,
    snippetIds,
    featured,
    description,
    theme = null,
    ...rest
  }) {
    if (!name || !slug || !featured || !snippetIds || !snippetIds.length) {
      throw new ArgsError(
        "Missing required keys. One or more of the following keys were not specified: 'name', 'slug', 'featured', 'snippetIds'"
      );
    }

    this.name = name;
    this.description = description;
    this.slug = slug;
    this.featured = featured;
    this.theme = theme;
    this.snippetIds = snippetIds;
    Object.keys(rest).forEach(key => {
      this[key] = rest[key];
    });

    CollectionConfig.instances.add(this.id, this);

    return this;
  }

  static instances = new InstanceCache();

  get id() {
    return `${this.slug}`;
  }

  get icon() {
    return this.theme ? this.theme.iconName : null;
  }

  get assetPath() {
    return `/${global.settings.paths.staticAssetPath}`;
  }

  get outPath() {
    return global.settings.paths.contentPath;
  }
}
