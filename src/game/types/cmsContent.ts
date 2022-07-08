export interface TechnologyContent {
  items: string[];
}

export interface TechnologyTreeFlattened {
  items: {
    id: string;
    title: string;
    content: string;
    parent?: string;
    code: string;
    points: number;
    total: number;
  }[];
}

export interface TechnologyTree {
  id: string;
  title: string;
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
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface IdentifiableExperience extends Experience {
  id: number;
}

export interface IFeaturedProject {
  content: string;
  createdAt: Date;
  title: string;
  titleUrl: string;
  iconName: string;
  iconColor: string;
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
  public iconName: string;
  public iconColor: string;
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
  iconName: string;
  iconColor: string;
  techTags: {
    items: string[];
  };
}

export interface IGameCmsContent {
  aboutContent: string | null;
  technologyContent: TechnologyContent | null;
  technologyTree: TechnologyTreeFlattened | null;
  experiencesContent: Experience[] | null;
  featuredContent: IFeaturedProject[] | null;
  otherContent: OtherProject[] | null;
}

export class GameCmsContent implements IGameCmsContent {
  public aboutContent: string | null;
  public technologyContent: TechnologyContent | null;
  public technologyTree: TechnologyTreeFlattened | null;
  public experiencesContent: Experience[] | null;
  public featuredContent: FeaturedProject[] | null;
  public otherContent: OtherProject[] | null;

  constructor() {
    this.aboutContent = null;
    this.technologyContent = null;
    this.technologyTree = null;
    this.experiencesContent = null;
    this.featuredContent = null;
    this.otherContent = null;
  }
}

export interface InventoryProject {
  title: string;
  url: string;
  content: string;
  techTags: string[];
  type: 'featured' | 'other';
  iconName: string;
  iconColor: string;
}
