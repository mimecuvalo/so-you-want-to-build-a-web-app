export default function Homepage() {
  return null;
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/so-you-want-to-build-a-web-app',
      permanent: true,
    },
  };
}
