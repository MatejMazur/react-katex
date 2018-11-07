import React, { memo } from 'react';
import PropTypes from 'prop-types';
import KaTeX from 'katex';

/**
 * @typedef {object} TeXProps
 * @prop {string} [children]
 * @prop {string} [math]
 * @prop {boolean} [block]
 * @prop {string} [errorColor]
 * @prop {(error: TypeError|KaTeX.ParseError) => React.ReactElement} [renderError]
 *
 * Renders LaTeX math
 * @param {TeXProps} props
 * @return {React.ReactElement}
 */
function TeX(props) {
  const otherProps = omit(
    ['children', 'math', 'block', 'errorColor', 'renderError'],
    props
  );
  const Component = props.block ? 'div' : 'span';
  const content = props.children || props.math;

  try {
    const html = KaTeX.renderToString(content, {
      displayMode: !!props.block,
      errorColor: props.errorColor,
      throwOnError: !!props.renderError
    });

    return (
      <Component {...otherProps} dangerouslySetInnerHTML={{ __html: html }} />
    );
  } catch (error) {
    if (error instanceof KaTeX.ParseError || error instanceof TypeError) {
      return props.renderError ? (
        props.renderError(error)
      ) : (
        <Component
          {...otherProps}
          dangerouslySetInnerHTML={{ __html: error.message }}
        />
      );
    }

    throw error;
  }
}

TeX.propTypes = {
  children: PropTypes.string,
  math: PropTypes.string,
  block: PropTypes.bool,
  errorColor: PropTypes.string,
  renderError: PropTypes.func
};

export default memo(TeX);

function omit(keys, obj) {
  return Object.keys(obj).reduce(
    (acc, key) => (keys.includes(key) ? acc : ((acc[key] = obj[key]), acc)),
    {}
  );
}
