import {
  ErrorAlert,
  SectionBox,
  SortList,
  Tabs,
} from "@gothicgeeks/design-system";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "../../../hooks/configuration/configration.store";
import { useEntityDictionPlurals } from "../../../hooks/entity/entity.queries";
import {
  ENTITIES_MENU_ENDPOINT,
  useEntitiesList,
  useEntitiesMenuItems,
} from "../../../hooks/entity/entity.store";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import { BaseSettingsLayout } from ".././_Base";
import { EntitiesSelection } from "./Selection";

export const EntitiesSettings = () => {
  const entitiesList = useEntitiesList();
  const entitiesToHide = useAppConfiguration<string[]>(
    "entities_to_hide_from_menu"
  );
  const entitiesMenuItems = useEntitiesMenuItems();

  const upsertHideFromMenuMutation = useUpsertConfigurationMutation(
    "entities_to_hide_from_menu",
    "",
    { otherEndpoints: [ENTITIES_MENU_ENDPOINT] }
  );

  const upsertEntitiesOrderMutation = useUpsertConfigurationMutation(
    "entities_order",
    "",
    { otherEndpoints: [ENTITIES_MENU_ENDPOINT] }
  );

  const entitiesDictionPlurals = useEntityDictionPlurals(
    entitiesList.data || [],
    "value"
  );

  return (
    <BaseSettingsLayout
      menuItem={{
        link: NAVIGATION_LINKS.SETTINGS.ENTITIES,
        name: "Entities Settings",
      }}
    >
      <ErrorAlert message={entitiesList.error || entitiesToHide.error} />
      <SectionBox title="Entities Settings">
        <Tabs
          contents={[
            {
              content: (
                <EntitiesSelection
                  description="Select the entitites that you want on to appear in the app i.e Tables, Home Page, Charts etc"
                  isLoading={entitiesList.isLoading || entitiesToHide.isLoading}
                  allList={entitiesList.data || []}
                  getEntityFieldLabels={entitiesDictionPlurals}
                  hiddenList={entitiesToHide.data || []}
                  onSubmit={async (data) => {
                    await upsertHideFromMenuMutation.mutateAsync(data);
                  }}
                />
              ),
              label: "Menu Entities",
            },
            {
              content: (
                <SortList
                  data={entitiesMenuItems}
                  onSave={async (data) => {
                    await upsertEntitiesOrderMutation.mutateAsync(data);
                  }}
                />
              ),
              label: "Order",
            },
          ]}
        />
      </SectionBox>
    </BaseSettingsLayout>
  );
};
