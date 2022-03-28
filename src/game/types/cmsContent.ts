export interface TechnologyContent {
  items: string[];
}

export interface TechnologyTreeFlattened {
  items: {
    id: string;
    content: string;
    parent?: string;
    code: string;
    points: number;
    total: number;
  }[];
}

export interface TechnologyTree {
  id: string;
  content: string;
  parent?: string;
  code: string;
  points: number;
  total: number;
  children?: TechnologyTree[];
}

export interface Experience {
  employer: string;
  subtitle: string;
  title: string;
  content: {
    items: string[];
  };
}

export interface IFeaturedProject {
  content: string;
  createdAt: Date;
  title: string;
  titleUrl: string;
  image: {
    localFile: {
      childImageSharp: {
        fluid: {
          src: string;
        };
      };
    };
  };
  techTags: {
    items: string[];
  };
}

export class FeaturedProject implements IFeaturedProject {
  public content: string;
  public createdAt: Date;
  public title: string;
  public titleUrl: string;
  public image: {
    localFile: {
      childImageSharp: {
        fluid: {
          src: string;
        };
      };
    };
  };
  public techTags: {
    items: string[];
  };

  public static getImageUrl = (image: FeaturedProject['image']) =>
    image.localFile.childImageSharp.fluid.src;
}

export interface OtherProject {
  content: string;
  createdAt: Date;
  repositoryUrl: string;
  title: string;
  websiteUrl: string;
  techTags: {
    items: string[];
  };
}

export interface IGameCmsContent {
  aboutContent: string;
  technologyContent: TechnologyContent;
  technologyTree: TechnologyTreeFlattened;
  experiencesContent: Experience[];
  featuredContent: IFeaturedProject[];
  otherContent: OtherProject[];
}

export class GameCmsContent implements IGameCmsContent {
  public aboutContent: string;
  public technologyContent: TechnologyContent;
  public technologyTree: TechnologyTreeFlattened;
  public experiencesContent: Experience[];
  public featuredContent: FeaturedProject[];
  public otherContent: OtherProject[];

  constructor() {
    this.aboutContent = null;
    this.technologyContent = null;
    this.technologyTree = null;
    this.experiencesContent = null;
    this.featuredContent = null;
    this.otherContent = null;
  }
}
