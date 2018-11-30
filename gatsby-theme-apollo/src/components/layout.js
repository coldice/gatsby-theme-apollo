import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import Slugger from 'github-slugger';
import styled from 'react-emotion';
import {Link, StaticQuery, graphql} from 'gatsby';
import {ReactComponent as Logo} from '../assets/logo.svg';

const Header = styled.header({
  padding: 16,
  color: 'white',
  backgroundColor: 'blue'
});

const StyledLogo = styled(Logo)({
  display: 'block',
  height: 40,
  fill: 'currentColor'
});

const Sidebar = styled.aside({
  width: 240,
  backgroundColor: 'lightgrey',
  float: 'left'
});

export default function Layout(props) {
  return (
    <StaticQuery
      query={graphql`
        {
          site {
            siteMetadata {
              title
            }
          }
          allMdx {
            edges {
              node {
                id
                parent {
                  ... on File {
                    name
                    absolutePath
                    relativePath
                  }
                }
                headings {
                  depth
                  value
                }
              }
            }
          }
        }
      `}
      render={data => {
        const slugger = new Slugger();
        const {title} = data.site.siteMetadata;
        return (
          <Fragment>
            <Helmet defaultTitle={title} titleTemplate={`%s · ${title}`}>
              <link rel="shortcut icon" src="/favicon.ico" />
            </Helmet>
            <Header>
              <StyledLogo />
            </Header>
            <Sidebar>
              <ul>
                {data.allMdx.edges.flatMap(edge =>
                  edge.node.headings.map(({depth, value}, index) => {
                    const slug = slugger.slug(value);
                    if (depth > 3) {
                      // return null here instead of using array.filter
                      // we want the slug results to match those from remark-slug
                      return null;
                    }

                    return (
                      <li key={`${edge.node.id}-${index}`}>
                        <Link to={`${edge.node.parent.name}#${slug}`}>
                          {depth === 1 ? <strong>{value}</strong> : value}
                        </Link>
                      </li>
                    );
                  })
                )}
              </ul>
            </Sidebar>
            <main>{props.children}</main>
          </Fragment>
        );
      }}
    />
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
