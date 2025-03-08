function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="rounded-lg border bg-card p-6 text-card-foreground">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-muted" />
          <div>
            <h2 className="text-xl font-semibold">User Name</h2>
            <p className="text-sm text-muted-foreground">user@example.com</p>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Activity History</h2>
        <div className="rounded-lg border bg-card p-4 text-card-foreground">
          <p className="text-muted-foreground">Your activity history will appear here.</p>
        </div>
      </section>
    </div>
  );
}

export default ProfilePage;
