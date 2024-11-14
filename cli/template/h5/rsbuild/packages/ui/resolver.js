function Resolver() {
  return {
    type: 'component',
    resolve: (name) => {
      if (name.startsWith('Hl')) {
        return {
          name,
          importName: name,
          from: '@hl/h5',
        }
      }
    },
  }
}

export const HlUIResolver = Resolver
export default Resolver
